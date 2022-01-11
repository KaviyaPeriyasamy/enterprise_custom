import frappe
from frappe import _

def create_dn_records(doc, action):
    allowed_item_group_list = {'All Item Groups':[], 'HARDWARE':[]}
    for row in doc.items:
        if row.item_group in allowed_item_group_list:
            allowed_item_group_list[row.item_group].append(row)
    
    for item_group in allowed_item_group_list:
        if allowed_item_group_list[item_group]:
            dn_doc = frappe.new_doc('Delivery Note')
            dn_doc.customer = doc.customer
            for item in allowed_item_group_list[item_group]:
                dn_doc.append('items', {'item_code': item.item_code,
                                        'item_name': item.item_name, 
                                        'description': item.description,
                                        'qty': item.qty,
                                        'stock_uom': item.stock_uom,
                                        'uom': item.uom,
                                        'conversion_factor': item.conversion_factor
                                        })
            dn_doc.save()
            dn_doc.submit()