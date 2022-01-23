import frappe
from frappe import _

# def create_dn_records(doc, action):
#     allowed_item_group_list = {'PLYWOOD-NE':[], 'DOORS':[], 'KITCEHN':[], 'BEEDING SECTION':[]}
#     for row in doc.items:
#         if row.item_group in allowed_item_group_list:
#             allowed_item_group_list[row.item_group].append(row)
    
#     for item_group in allowed_item_group_list:
#         if allowed_item_group_list[item_group]:
#             dn_doc = frappe.new_doc('Gudown Slip')
#             dn_doc.sales_invoice = doc.name,
#             dn_doc.customer = doc.customer
#             for item in allowed_item_group_list[item_group]:
#                 dn_doc.append('items', {'item_code': item.item_code,
#                                         'item_name': item.item_name, 
#                                         'description': item.description,
#                                         'qty': item.qty,
#                                         'stock_uom': item.stock_uom,
#                                         'uom': item.uom
#                                         })
#             dn_doc.save()
#             dn_doc.submit()


def create_godown_slip(doc, action):
    if doc.invoice_type == 'Cash Invoice' and action == 'on_submit':
        godown_doc = frappe.new_doc('Gudown Slip')
        godown_doc.date = doc.posting_date
        godown_doc.sales_invoice = doc.name
        godown_doc.customer = doc.customer
        godown_doc.customer_name = doc.customer_name
        godown_doc.items = []
        for row in doc.items:
            godown_doc.append('items', {'item_code': row.item_code, 'item_name': row.item_name,
            'description': row.description, 'uom': row.uom, 'qty': row.qty})
        godown_doc.save()
    if doc.invoice_type == 'Credit Invoice' and action == 'validate':
        gs_doc = frappe.db.get_value('Gudown Slip', {'sales_invoice': doc.name})
        if gs_doc:
            godown_doc = frappe.get_doc('Gudown Slip', gs_doc)
            godown_doc.date = doc.posting_date
            godown_doc.sales_invoice = doc.name
            godown_doc.customer = doc.customer
            godown_doc.customer_name = doc.customer_name
            godown_doc.items = []
            for row in doc.items:
                godown_doc.append('items', {'item_code': row.item_code, 'item_name': row.item_name,
                'description': row.description, 'uom': row.uom, 'qty': row.qty})
            godown_doc.save()
        else:
            godown_doc = frappe.new_doc('Gudown Slip')
            godown_doc.date = doc.posting_date
            godown_doc.sales_invoice = doc.name
            godown_doc.customer = doc.customer
            godown_doc.customer_name = doc.customer_name
            godown_doc.items = []
            for row in doc.items:
                godown_doc.append('items', {'item_code': row.item_code, 'item_name': row.item_name,
                'description': row.description, 'uom': row.uom, 'qty': row.qty})
            godown_doc.save()

