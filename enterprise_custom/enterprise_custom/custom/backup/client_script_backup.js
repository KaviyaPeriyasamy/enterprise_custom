frappe.ui.form.on("Sales Invoice Item",
{
	sqft: function(frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.sqft) {
		    if(d.qty){
		    frappe.model.set_value(cdt, cdn, 'total_sqft', d.sqft * d.qty);
		    }
		    else{
		        frappe.model.set_value(cdt, cdn, 'total_sqft', d.sqft * 1);
		    }
		    console.log("dsff")
		    setTimeout(() => {
			frappe.model.set_value(cdt, cdn, 'amount', d.total_sqft * d.rate);}, 2000);
		}
	},
	qty: function(frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		 if(d.qty){
		frappe.model.set_value(cdt, cdn, 'total_sqft', d.sqft * d.qty);
		 }
		 else{
		     frappe.model.set_value(cdt, cdn, 'total_sqft', d.sqft * 1);
		 }
		 	setTimeout(() => {
		frappe.model.set_value(cdt, cdn, 'amount', d.total_sqft * d.rate);}, 2000);
	},
	total_sqft: function(frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		console.log("hdhvhdvhd")
			setTimeout(() => {
		frappe.model.set_value(cdt, cdn, 'amount', d.total_sqft * d.rate);	}, 2000);
	},
	price_list_rate: function(frm, cdt, cdn) {
		const d = locals[cdt][cdn];
			setTimeout(() => {
		frappe.model.set_value(cdt, cdn, 'amount', d.total_sqft * d.rate);}, 2000);
	},
	rate: function(frm, cdt, cdn) {
		const d = locals[cdt][cdn];
			setTimeout(() => {
		frappe.model.set_value(cdt, cdn, 'amount', d.total_sqft * d.rate);}, 2000);
	},
	item_code: function(frm, cdt, cdn) {
	    const d = locals[cdt][cdn];
	    frappe.db.get_value('Item', d.item_code, 'total_sft', (r) => {
		    frappe.model.set_value(cdt, cdn, 'sqft', r.total_sft);
		    frappe.model.set_value(cdt, cdn, 'total_sqft', r.total_sft * 1);
		})
		frappe.model.set_value(cdt, cdn, 'amount', d.total_sqft * d.rate);
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
	},
});
frappe.ui.form.on('Sales Invoice', {
    on_save(frm) {
	    let re =  0;
	    re = frappe.model.add_child(frm.doc, 'Sales Invoice Payment', 'payments');
	    	setTimeout(() => {
	    frappe.model.set_value(re.doctype, re.name, 'amount',frm.doc.grand_total);}, 2000);
	},
// 	on_submit:function(frm){
//         if(!frm.doc.godown_slip){
//       frappe.db.insert({
//           "doctype":"Godown Slip",
//           "sale_invoice":frm.doc.name,
//           "customer_name":frm.doc.customer,
//           "items":frm.doc.items
//       }).then(vlt => {
//                 frappe.model.set_value(frm.doctype, frm.doc.name, 'Godown Slip', vlt);
//                 frm.set_value("godown_slip",vlt.name)
//             });
//         }
//     },
	invoice_type: function(frm){
	    if(frm.doc.invoice_type === "CASH INVOICE"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Hardware";
        frm.doc.tc_name = "Sales";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('tc_name');
        refresh_field('naming_series');
        }
        else if(cur_frm.doc.invoice_type === "CREDIT INVOICE"){
            cur_frm.doc.is_pos = 0;
            cur_frm.doc.pos_profile = "";
            cur_frm.doc.payment_terms_template = "15 Days";
            cur_frm.doc.tc_name = "Credit Sales";
            frm.set_value('naming_series','CR-NE-.YY.-');
            cur_frm.refresh_field('naming_series');
            refresh_field('is_pos');
            refresh_field('pos_profile');
            refresh_field('payment_terms_template');
            refresh_field('tc_name');    
            refresh_field('naming_series');
        }
        
        else{
            cur_frm.doc.is_pos = 0;
            cur_frm.doc.pos_profile = "";
            frm.set_value('naming_series','');
            refresh_field('is_pos');
            refresh_field('pos_profile');
            refresh_field('naming_series');
        }
	},
	user: function(frm){
	    if(frm.doc.user === "viswanath@nirmalagroup.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Power Tools";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-PT-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
        else if(frm.doc.user === "kumar@nirmalagroup.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Doors";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
        else if(frm.doc.user === "madhu@nirmalagroup.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Hardware Madhu";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
        else if(frm.doc.user === "gayathri@nirmalagroup.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Hardware Gayathri";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
        else if(frm.doc.user === "prasanna@nirmalagroup.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Hardware Prasanna";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
        else if(frm.doc.user === "sivaji@nirmalagroup.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Hardware";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
        else if(frm.doc.user === "siva@nirmalagroup.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Admin";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
        else if(frm.doc.user === "rahul@nirmalaenterprises.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Admin";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
        else if(frm.doc.user === "amisha@nirmalagroup.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Hardware Amisha";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
        else if(frm.doc.user === "teja@nirmalagroup.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Hardware Teja";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
        else if(frm.doc.user === "radha@nirmalagroup.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Hardware Radha";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
        else if(frm.doc.user === "hema@nirmalagroup.org"){
        frm.doc.is_pos = 1;
        frm.doc.pos_profile = "Hardware Hema";
        frm.doc.invoice_type = "Cash Invoice";
        frm.set_value('naming_series','CA-NE-.YY.-');
        refresh_field('is_pos');
        refresh_field('pos_profile');
        refresh_field('invoice_type');
        refresh_field('naming_series');
        }
	}
	
});

