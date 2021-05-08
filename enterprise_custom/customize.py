# Copyright (c) 2013, Crio and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def update_item_price(doc, action):
	if doc.total_square_feet:
		price_list_rate = frappe.db.get_value('Item Price', {'item_code': doc.name, 'selling':1}, 'price_list_rate')
		frappe.db.set_value('Item Price',{'item_code': doc.name, 'selling':1},'price_list_rate',price_list_rate * doc.total_square_feet)