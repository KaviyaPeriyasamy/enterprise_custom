frappe.ui.form.on("Sales Invoice Item", "sqft", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn];
    d.amount = d.rate * d.sqft * d.qty
	refresh_field('items');
});