frappe.ui.form.on("Sales Invoice Item", "square_feet", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn];
    d.amount = d.rate * d.square_feet * d.qty
	refresh_field('items');
});