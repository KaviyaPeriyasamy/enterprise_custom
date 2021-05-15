
frappe.ui.form.on("Sales Invoice Item",
{
	sqft: function(frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.sqft) {
			frappe.model.set_value(cdt, cdn, 'amount', d.rate * d.sqft * d.qty);
				
		}
	}
});

frappe.ui.form.on("POS Invoice Item",
{
	sqft: function(frm, cdt, cdn) {
		const d = locals[cdt][cdn];
		if (d.sqft) {
			frappe.model.set_value(cdt, cdn, 'amount', d.rate * d.sqft * d.qty);
				
		}
	}
});


frappe.ui.form.on("Sales Invoice Item",
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
					    frappe.model.set_value(cdt, cdn, 'item_attribute', r.message);
					}
				}
			});
	}
});
