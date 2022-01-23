# -*- coding: utf-8 -*-
# Copyright (c) 2021, Crio and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ItemAttributeDetails(Document):
	pass

@frappe.whitelist()
def get_item_attribute(item):
	attribute_list = frappe.db.get_list('Item Attribute Details', {'parent':item, 'enabled':1}, ['product_attribute'])
	attr_list = [row['product_attribute'] for row in attribute_list]
	if len(attr_list) < 5:
		for i in range(0, 5-len(attr_list)):
			attr_list.append('')
	return attr_list