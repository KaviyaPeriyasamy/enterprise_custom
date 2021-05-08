# Copyright (c) 2013, Crio and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from erpnext.stock.doctype.item.item import Item

def update_item_price(doc, action):
	if doc.total_square_feet:
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
				"price_list_rate": self.standard_rate * self.total_square_feet
			})
			item_price.insert()