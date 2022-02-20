import frappe
from frappe import _
from frappe.utils import get_link_to_form

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
    item_group_dict = {'PLYWOOD-NE':[], 'DOORS':[], 'ALUMINIUM-NE':[], 'WOOD BEEDING-NE':[], 'KITCHEN BASKETS':[]}
    for row in doc.items:
        subgroup = frappe.db.get_value('Item', row.item_code,"sub_group")
        if not row.item_group in item_group_dict:
            if not subgroup in item_group_dict:
                continue
            else:
                item_group_dict[subgroup].append(row.item_code)
        else:
            item_group_dict[row.item_group].append(row.item_code)
    if doc.invoice_type == 'Cash Invoice' and action == 'on_submit':
        links = ''
        for row1 in item_group_dict:
            godown_doc = frappe.new_doc('Gudown Slip')
            godown_doc.date = doc.posting_date
            godown_doc.sales_invoice = doc.name
            godown_doc.customer = doc.customer
            godown_doc.customer_name = doc.customer_name
            godown_doc.items = []
            count = 0
            for row2 in doc.items:
                if row2.item_code in item_group_dict[row1]:
                    count +=1
                    godown_doc.append('items', {'item_code': row2.item_code, 'item_name': row2.item_name,
                    'description': row2.description, 'uom': row2.uom, 'qty': row2.qty})
            if count:
                godown_doc.save()
                links +=f" , {get_link_to_form('Gudown Slip', godown_doc.name)}"
        if links:
            frappe.msgprint(_(f"Gudown Slip(s) {links} Created"))

    if doc.invoice_type == 'Credit Invoice' and ((action == 'validate' and not doc.is_new())or action == 'after_insert'):
        gs_doc_list = frappe.db.get_list('Gudown Slip', {'sales_invoice': doc.name})
        links = ''
        if gs_doc_list:
            for gs_doc in gs_doc_list:
                frappe.delete_doc("Gudown Slip", gs_doc['name'])
            for row1 in item_group_dict:
                godown_doc = frappe.new_doc('Gudown Slip')
                godown_doc.date = doc.posting_date
                godown_doc.sales_invoice = doc.name
                godown_doc.customer = doc.customer
                godown_doc.customer_name = doc.customer_name
                godown_doc.items = []
                count = 0
                for row2 in doc.items:
                    if row2.item_code in item_group_dict[row1]:
                        count +=1
                        godown_doc.append('items', {'item_code': row2.item_code, 'item_name': row2.item_name,
                        'description': row2.description, 'uom': row2.uom, 'qty': row2.qty})
                if count:
                    godown_doc.save()
                    links +=f" , {get_link_to_form('Gudown Slip', godown_doc.name)}"
            if links:
                frappe.msgprint(_(f"Gudown Slip(s) {links} Updated"))

        else:
            for row1 in item_group_dict:
                godown_doc = frappe.new_doc('Gudown Slip')
                godown_doc.date = doc.posting_date
                godown_doc.sales_invoice = doc.name
                godown_doc.customer = doc.customer
                godown_doc.customer_name = doc.customer_name
                godown_doc.items = []
                count = 0
                for row2 in doc.items:
                    if row2.item_code in item_group_dict[row1]:
                        count +=1
                        godown_doc.append('items', {'item_code': row2.item_code, 'item_name': row2.item_name,
                        'description': row2.description, 'uom': row2.uom, 'qty': row2.qty})
                if count:
                    godown_doc.save()
                    links +=f" , {get_link_to_form('Gudown Slip', godown_doc.name)}"
            if links:
                frappe.msgprint(_(f"Gudown Slip(s) {links} Created"))

