# Copyright (c) 2013, Crio and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import erpnext
from erpnext.stock.doctype.item.item import Item
from erpnext.accounts.doctype.pos_invoice_merge_log.pos_invoice_merge_log import POSInvoiceMergeLog
from frappe.model.mapper import map_doc, map_child_doc
from frappe.utils import flt
import json

def update_item_price(doc, action):
	if doc.total_square_feet and doc.item_group == 'DOORS':
		price_list_rate = frappe.db.get_value('Item Price', {'item_code': doc.name, 'selling':1}, 'price_list_rate')
		frappe.db.set_value('Item Price',{'item_code': doc.name, 'selling':1},'price_list_rate',price_list_rate * doc.total_square_feet)

class ERPNextItem(Item):
	def add_price(self, price_list=None):
		'''Add a new price'''
		if not price_list:
			price_list = (frappe.db.get_single_value('Selling Settings', 'selling_price_list')
						or frappe.db.get_value('Price List', _('Standard Selling')))
		if price_list:
			item_price = frappe.get_doc({
				"doctype": "Item Price",
				"price_list": price_list,
				"item_code": self.name,
				"currency": erpnext.get_default_currency(),
				"price_list_rate": self.standard_rate * self.total_square_feet if self.item_group == 'DOORS' and self.total_square_feet else self.standard_rate
			})
			item_price.insert()

class ERPNextPOSInvoiceMergeLog(POSInvoiceMergeLog):
	def merge_pos_invoice_into(self, invoice, data):
		items, payments, taxes = [], [], []
		loyalty_amount_sum, loyalty_points_sum = 0, 0
		for doc in data:
			map_doc(doc, invoice, table_map={ "doctype": invoice.doctype })

			if doc.redeem_loyalty_points:
				invoice.loyalty_redemption_account = doc.loyalty_redemption_account
				invoice.loyalty_redemption_cost_center = doc.loyalty_redemption_cost_center
				loyalty_points_sum += doc.loyalty_points
				loyalty_amount_sum += doc.loyalty_amount
			
			invoice.apply_discount_on = doc.apply_discount_on
			invoice.additional_discount_percentage = doc.additional_discount_percentage
			invoice.discount_amount = doc.discount_amount
			invoice.net_total = doc.net_total

			for item in doc.get('items'):
				found = False
				for i in items:
					if (i.item_code == item.item_code and not i.serial_no and not i.batch_no and
						i.uom == item.uom and i.net_rate == item.net_rate):
						found = True
						i.qty = i.qty + item.qty

				if not found:
					item.price_list_rate = 0
					si_item = map_child_doc(item, invoice, {"doctype": "Sales Invoice Item"})
					items.append(si_item)

			for tax in doc.get('taxes'):
				found = False
				for t in taxes:
					if t.account_head == tax.account_head and t.cost_center == tax.cost_center:
						t.tax_amount = flt(t.tax_amount) + flt(tax.tax_amount_after_discount_amount)
						t.base_tax_amount = flt(t.base_tax_amount) + flt(tax.base_tax_amount_after_discount_amount)
						update_item_wise_tax_detail(t, tax)
						found = True
				if not found:
					taxes.append(tax)

			for payment in doc.get('payments'):
				found = False
				for pay in payments:
					if pay.account == payment.account and pay.mode_of_payment == payment.mode_of_payment:
						pay.amount = flt(pay.amount) + flt(payment.amount)
						pay.base_amount = flt(pay.base_amount) + flt(payment.base_amount)
						found = True
				if not found:
					payments.append(payment)

		if loyalty_points_sum:
			invoice.redeem_loyalty_points = 1
			invoice.loyalty_points = loyalty_points_sum
			invoice.loyalty_amount = loyalty_amount_sum

		invoice.set('items', items)
		invoice.set('payments', payments)
		invoice.set('taxes', taxes)
		invoice.taxes_and_charges = None
		invoice.ignore_pricing_rule = 1

		return invoice

def update_item_wise_tax_detail(consolidate_tax_row, tax_row):
	consolidated_tax_detail = json.loads(consolidate_tax_row.item_wise_tax_detail)
	tax_row_detail = json.loads(tax_row.item_wise_tax_detail)

	if not consolidated_tax_detail:
		consolidated_tax_detail = {}

	for item_code, tax_data in tax_row_detail.items():
		if consolidated_tax_detail.get(item_code):
			consolidated_tax_data = consolidated_tax_detail.get(item_code)
			consolidated_tax_detail.update({
				item_code: [consolidated_tax_data[0], consolidated_tax_data[1] + tax_data[1]]
			})
		else:
			consolidated_tax_detail.update({
				item_code: [tax_data[0], tax_data[1]]
			})

	consolidate_tax_row.item_wise_tax_detail = json.dumps(consolidated_tax_detail, separators=(',', ':'))