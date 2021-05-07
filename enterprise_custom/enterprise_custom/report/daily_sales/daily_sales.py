# Copyright (c) 2013, Crio and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _, scrub
from erpnext.stock.utils import get_incoming_rate
from erpnext.controllers.queries import get_match_cond
from frappe.utils import flt, cint


def execute(filters=None):
	if not filters: filters = frappe._dict()
	filters.currency = frappe.get_cached_value('Company',  filters.company,  "default_currency")
	filters['group_by'] = 'Item Group'
	gross_profit_data = GrossProfitGenerator(filters)

	data = []

	group_wise_columns = frappe._dict({
		"item_group": ["sub_group", "qty", "base_amount"]
	})

	columns = get_columns(group_wise_columns, filters)

	for src in gross_profit_data.grouped_data:
		row = []
		for col in group_wise_columns.get(scrub(filters.group_by)):
			row.append(src.get(col))
		row.append(src.get('parenttype'))

		row.append(filters.currency)
		data.append(row)
	return columns, data

def get_columns(group_wise_columns, filters):
	columns = []
	column_map = frappe._dict({
		"parent": _("Invoice") + ":Dynamic Link/parenttype:120",
		"sub_group": _("Product") + ":Link/Item Group:200",
		"qty": _("Qty") + ":Float:200",
		"base_amount": _("Total Value") + ":Currency/currency:200"
	})

	for col in group_wise_columns.get(scrub(filters.group_by)):
		columns.append(column_map.get(col))
	
	columns.append({
		"fieldname": "parenttype",
		"label" : _("Parent Type"),
		"fieldtype": "Data",
		"hidden": 1
	})
	columns.append({
		"fieldname": "currency",
		"label" : _("Currency"),
		"fieldtype": "Link",
		"options": "Currency",
		"hidden": 1
	})

	return columns

class GrossProfitGenerator(object):
	def __init__(self, filters=None):
		self.data = []
		self.average_buying_rate = {}
		self.filters = frappe._dict(filters)
		self.load_invoice_items()
		self.process()

	def process(self):
		self.grouped = {}
		self.grouped_data = []

		self.currency_precision = cint(frappe.db.get_default("currency_precision")) or 3
		self.float_precision = cint(frappe.db.get_default("float_precision")) or 2

		for row in self.si_list:
			row.base_amount = flt(row.base_net_amount, self.currency_precision)
			row.sub_group = frappe.db.get_value('Item', row.item_code, 'sub_group')
			self.grouped.setdefault(row.get('sub_group'), []).append(row)

		if self.grouped:
			self.get_average_rate_based_on_group_by()

	def get_average_rate_based_on_group_by(self):
		# sum buying / selling totals for group
		for key in list(self.grouped):
			if self.filters.get("group_by") != "Invoice":
				for i, row in enumerate(self.grouped[key]):
					if i==0:
						new_row = row
					else:
						new_row.qty += row.qty
						new_row.base_amount += flt(row.base_amount, self.currency_precision)

				self.grouped_data.append(new_row)

	def load_invoice_items(self):
		conditions = ""
		if self.filters.company:
			conditions += " and company = %(company)s"
		if self.filters.from_date:
			conditions += " and posting_date >= %(from_date)s"
		if self.filters.to_date:
			conditions += " and posting_date <= %(to_date)s"

		sales_person_cols = ""
		sales_team_table = ""

		self.si_list = self.cust_query('Sales Invoice',conditions, sales_person_cols, sales_team_table) \
						+ self.cust_query('POS Invoice',conditions, sales_person_cols, sales_team_table)

	def cust_query(self, inv_name,conditions, sales_person_cols, sales_team_table):
		return frappe.db.sql("""
			select
				`inv_item`.parenttype, `inv_item`.parent,
				`si`.posting_date, `si`.posting_time,
				`si`.project, `si`.update_stock,
				`si`.customer, `si`.customer_group,
				`si`.territory, `inv_item`.item_code,
				`inv_item`.item_name, `inv_item`.description,
				`inv_item`.warehouse, `inv_item`.item_group,
				`inv_item`.brand, `inv_item`.dn_detail,
				`inv_item`.delivery_note, `inv_item`.stock_qty as qty,
				`inv_item`.base_net_rate, `inv_item`.base_net_amount,
				`inv_item`.name as "item_row", `si`.is_return,
				`inv_item`.cost_center
				{sales_person_cols}
			from
			`tab{inv_name}` si inner join `tab{inv_name} Item` inv_item
					on `inv_item`.parent = si.name
				{sales_team_table}
			where
				`si`.is_opening!='Yes' {conditions} {match_cond}
			order by
				`si`.posting_date desc, `si`.posting_time desc"""
			.format(inv_name = inv_name, conditions=conditions, sales_person_cols=sales_person_cols,
				sales_team_table=sales_team_table, match_cond = get_match_cond(inv_name)), self.filters, as_dict=1)