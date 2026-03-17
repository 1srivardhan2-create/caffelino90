Current Issue:
When I press “Collect Cash”, the cash amount:

Is recorded as ₹0.00

Is NOT added to Earnings

Is NOT shown in Earnings Breakdown

Order remains stuck in payment state

Current Order State Example:

totalBill: ₹913.50

paymentMethod: CASH

paymentStatus: PENDING

cashPending: ₹913.50

Root Problem to Fix:

“Collect Cash” button is not passing the actual bill amount

Earnings logic is not triggered after cash collection

Cash collection and earnings update are not linked

EXPECTED & CORRECT CASH FLOW (MANDATORY):

When Collect Cash is clicked:

1️⃣ Read Amount

Fetch totalBill from the order (example: ₹913.50)

DO NOT use hardcoded values

DO NOT default to 0

2️⃣ Update Order (Cash Collected)

Update the order with:

paymentStatus = "PAID"

paymentMethod = "CASH"

cashCollected = totalBill

cashPending = 0

paidAt = timestamp

3️⃣ Save to Earnings (CRITICAL)

Immediately add the collected cash to Earnings:

Increase:

todayEarnings += totalBill

totalEarnings += totalBill

Save breakdown:

orderId

amount: ₹913.50

paymentType: CASH

date & time

4️⃣ UI State After Collection

Remove “Waiting for payment”

Hide / disable Collect Cash button

Show success message:
👉 “Cash collected: ₹913.50”

STRICT RULES:

Cash collection = Earnings update (must happen together)

If earnings update fails → rollback order update

Do NOT allow ₹0 entries in earnings

This is a counter-based cash system only

Debug & Fix Requirements:

Log the value passed on Collect Cash click

Verify backend receives correct amount

Ensure earnings write is executed

Ensure earnings breakdown is persisted

Deliverables:

Identify why ₹0 is saved

Fix frontend → backend data flow

Fix earnings save logic

Final working cash-only flow

DO NOT add online payments. DO NOT change UI. Only fix logic.