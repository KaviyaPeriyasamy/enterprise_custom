frappe.ui.form.on("POS Invoice Item",
{
	sqft: function(frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.sqft) {
			frappe.model.set_value(cdt, cdn, 'amount', d.rate * d.sqft * d.qty);

		}
	},
	qty: function(frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		frappe.db.get_value('Item', d.item_code, 'total_sft', (r) => {
		    frappe.model.set_value(cdt, cdn, 'sqft', r.total_sft);
		})
	},
		item_code: function(frm, cdt, cdn) {
	    const d = locals[cdt][cdn];
	    frappe.call({
				method: 'enterprise_custom.enterprise_custom.doctype.item_attribute_details.item_attribute_details.get_item_attribute',
				args: {
					'item': d.item_code
				},
				callback: function(r) {
					if (r.message) {
					    frappe.model.set_value(cdt, cdn, 'item_attribute', r.message[0]);
					    frappe.model.set_value(cdt, cdn, 'item_attribute_2', r.message[1]);
					    frappe.model.set_value(cdt, cdn, 'item_attribute_3', r.message[2]);
					    frappe.model.set_value(cdt, cdn, 'item_attribute_4', r.message[3]);
					    frappe.model.set_value(cdt, cdn, 'item_attribute_5', r.message[4]);
					}
				}
			});
	}
});

// backup sales invoice custom script

// frappe.ui.form.on("Sales Invoice Item",
// {
// 	sqft: function(frm, cdt, cdn) {
// 		const d = locals[cdt][cdn];
// 		if (d.sqft) {
// 		    if(d.qty){
// 		    frappe.model.set_value(cdt, cdn, 'total_sqft', d.sqft * d.qty);
// 		    }
// 		    else{
// 		        frappe.model.set_value(cdt, cdn, 'total_sqft', d.sqft * 1);
// 		    }
// 			frappe.model.set_value(cdt, cdn, 'amount', d.total_sqft * d.rate);
// 		}
// 	},
// 	qty: function(frm, cdt, cdn) {
// 		const d = locals[cdt][cdn];
// 		 if(d.qty){
// 		frappe.model.set_value(cdt, cdn, 'total_sqft', d.sqft * d.qty);
// 		 }
// 		 else{
// 		     frappe.model.set_value(cdt, cdn, 'total_sqft', d.sqft * 1);
// 		 }
// 		frappe.model.set_value(cdt, cdn, 'amount', d.total_sqft * d.rate);
// 	},
// 	total_sqft: function(frm, cdt, cdn) {
// 		const d = locals[cdt][cdn];
// 		frappe.model.set_value(cdt, cdn, 'amount', d.total_sqft * d.rate);
// 	},
// 	rate: function(frm, cdt, cdn) {
// 		const d = locals[cdt][cdn];
// 		frappe.model.set_value(cdt, cdn, 'amount', d.total_sqft * d.rate);
// 	},
// 	item_code: function(frm, cdt, cdn) {
// 	    const d = locals[cdt][cdn];
// 	    frappe.db.get_value('Item', d.item_code, 'total_sft', (r) => {
// 		    frappe.model.set_value(cdt, cdn, 'sqft', r.total_sft);
// 		    frappe.model.set_value(cdt, cdn, 'total_sqft', r.total_sft * 1);
// 		})
// 	    frappe.call({
// 				method: 'enterprise_custom.enterprise_custom.doctype.item_attribute_details.item_attribute_details.get_item_attribute',
// 				args: {
// 					'item': d.item_code
// 				},
// 				callback: function(r) {
// 					if (r.message) {
// 					    frappe.model.set_value(cdt, cdn, 'item_attribute', r.message[0]);
// 					    frappe.model.set_value(cdt, cdn, 'item_attribute_2', r.message[1]);
// 					    frappe.model.set_value(cdt, cdn, 'item_attribute_3', r.message[2]);
// 					    frappe.model.set_value(cdt, cdn, 'item_attribute_4', r.message[3]);
// 					    frappe.model.set_value(cdt, cdn, 'item_attribute_5', r.message[4]);
// 					}
// 				}
// 			});
// 	},
// });
// frappe.ui.form.on('Sales Invoice', {
//     on_save(frm) {
// 	    let re =  0;
// 	    re = frappe.model.add_child(frm.doc, 'Sales Invoice Payment', 'payments');
// 	    frappe.model.set_value(re.doctype, re.name, 'amount',frm.doc.grand_total);
// 	},
// 	invoice_type: function(frm){
// 	    if(frm.doc.invoice_type === "Cash Invoice"){
//         frm.doc.is_pos = 1;
//         frm.doc.pos_profile = "Hardware";
//         frm.set_value('naming_series','HW-CI-.YY.-');
//         refresh_field('is_pos');
//         refresh_field('pos_profile');
//         refresh_field('naming_series');
//         }
//         else if(cur_frm.doc.invoice_type === "Credit Invoice"){
//             cur_frm.doc.is_pos = 0;
//             cur_frm.doc.pos_profile = "";
//             cur_frm.doc.payment_terms_template = "15 Days";
//             frm.set_value('naming_series','SINV-.YY.-');
//             cur_frm.refresh_field('naming_series');
//             refresh_field('is_pos');
//             refresh_field('pos_profile');
//             refresh_field('payment_terms_template');
//             refresh_field('naming_series');
//         }
//         // else if(cur_frm.doc.user === "viswanath@nirmalagroup.org"){
//         //     cur_frm.doc.is_pos = 1;
//         //     cur_frm.doc.pos_profile = "Power Tools";
//         //     frm.set_value('invoice_type','Cash Invoice');
//         //     frm.set_value('naming_series','PIN-.YY.-');
//         //     cur_frm.refresh_field('naming_series');
//         //     refresh_field('is_pos');
//         //     refresh_field('pos_profile');
//         //     refresh_field('naming_series');
//         //     refresh_field('invoice_type');
//         // }
//         // else if(cur_frm.doc.user === "kumar@nirmalagroup.org"){
//         //     cur_frm.doc.is_pos = 1;
//         //     cur_frm.doc.pos_profile = "Doors";
//         //     frm.set_value('invoice_type','Cash Invoice');
//         //     frm.set_value('naming_series','DR-CI-.YY.-');
//         //     cur_frm.refresh_field('naming_series');
//         //     refresh_field('is_pos');
//         //     refresh_field('pos_profile');
//         //     refresh_field('naming_series');
//         //     refresh_field('invoice_type');
//         // }
//         else{
//             cur_frm.doc.is_pos = 0;
//             cur_frm.doc.pos_profile = "";
//             frm.set_value('naming_series','');
//             refresh_field('is_pos');
//             refresh_field('pos_profile');
//             refresh_field('naming_series');
//         }
// 	},
// 	user: function(frm){
// 	    if(frm.doc.user === "viswanath@nirmalagroup.org"){
//         frm.doc.is_pos = 1;
//         frm.doc.pos_profile = "Power Tools";
//         frm.doc.invoice_type = "Cash Invoice";
//         frm.set_value('naming_series','PIN-.YY.-');
//         refresh_field('is_pos');
//         refresh_field('pos_profile');
//         refresh_field('invoice_type');
//         refresh_field('naming_series');
//         }
//         else if(frm.doc.user === "kumar@nirmalagroup.org"){
//         frm.doc.is_pos = 1;
//         frm.doc.pos_profile = "Doors";
//         frm.doc.invoice_type = "Cash Invoice";
//         frm.set_value('naming_series','DR-CI-.YY.-');
//         refresh_field('is_pos');
//         refresh_field('pos_profile');
//         refresh_field('invoice_type');
//         refresh_field('naming_series');
//         }
// 	}
	
// });

