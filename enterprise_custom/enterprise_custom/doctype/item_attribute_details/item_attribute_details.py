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
	return frappe.db.get_value('Item Attribute Details', {'parent':item, 'enabled':1}, 'attribute')