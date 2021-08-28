## Enterprise Custom

Customize reports and doctypes

**Note:
Refer for qty, rate column change:
erpnext/erpnext/public/js/controllers/taxes_and_totals.js

```calculate_item_values```



Also edit taxes_and_totals.py

```
if ((!item.qty) && me.frm.doc.is_return) {
      item.amount = flt(item.rate * -1, precision("amount", item));
    } else {
            if(item.sqft){
            item.amount = flt(item.rate * item.qty * item.sqft, precision("amount", item));
    }
    else{
            item.amount = flt(item.rate * item.qty, precision("amount", item));
    }
 ```

