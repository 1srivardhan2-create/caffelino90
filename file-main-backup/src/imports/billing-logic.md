Implement the complete billing structure with the following flow and logic:

🔹 1. BILLING STRUCTURE UI ORDER

Display in this exact order:

Edit Order Items

Split Bill

Item List

Subtotal

CGST

SGST

Total (Including Tax)

Apply Coupon

Final Payable

Pay ₹20 Token to Confirm

🔹 2. REMOVE FULL ONLINE PAYMENT

Remove full online payment option.

Customers should NOT pay full bill online.

Show message:

“Remaining amount must be paid at the café counter.”

Only ₹20 token payment should be online.

🔹 3. COMMISSION COUPON SYSTEM

Remove all old coupons.

Only one coupon must exist: Commission Coupon.

Commission = 6% of total bill.

Example:

Bill = ₹2000

Commission = 6%

Coupon value = ₹120

Coupon must:

Be shown inside “Apply Coupon”

NOT auto-apply

User must manually click Apply

After applying:

Deduct commission amount

Update Final Payable

Formula:

Coupon Value = Total Bill × 6%

🔹 4. SPLIT BILL SYSTEM (ADMIN CONTROLLED)

When Admin presses “Split Bill”:

Ask number of people

Automatically divide Final Payable equally

Generate split amount

Send message automatically in group chat

Chat message format:

Split Bill Update:
Total Bill: ₹2000
Number of People: 4
Amount per Person: ₹500
Please pay your share at the counter.

Split should not auto-trigger.

It should trigger only when Admin presses Split.

🔹 5. ₹20 TOKEN CONFIRMATION SYSTEM

After split (or normal bill):

Show button: “Pay ₹20 Token to Confirm Order”

Customer must pay ₹20 online.

After successful payment:

Order status = Confirmed

Send confirmation message in chat:

Order Confirmed.
₹20 token received.
Please pay remaining amount at the café counter.
🔹 6. EDIT ORDER OPTION

“Edit Order Items” button must:

Allow adding/removing items

Recalculate taxes

Recalculate commission coupon

Recalculate split amount (if already split)

🔹 7. IMPORTANT RULES

No auto discounts

No hidden offers

No automatic split

No full online payment

Dashboard must track:

Total Bill

Commission earned

Token payments

Pending counter payments

🔹 8. FULL FLOW SUMMARY

Submit Order
→ Billing Screen
→ Apply Coupon (optional)
→ Admin Split Bill (optional)
→ Pay ₹20 Token
→ Order Confirmed
→ Pay remaining at counter

🧠 EXTRA THINGS YOU MAY HAVE MISSED (IMPORTANT)

Add these if not already:

✅ Show “Remaining Amount to Pay at Counter” clearly
✅ Prevent duplicate split
✅ Prevent multiple token payments
✅ Handle odd split amounts (₹1 difference logic)
✅ Show order status (Pending / Confirmed / Completed)
✅ Lock order after confirmation