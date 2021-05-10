
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