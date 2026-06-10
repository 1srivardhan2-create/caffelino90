# ✅ Testing Checklist - Café Owner Billing Dashboard

## Pre-Testing Setup
- [ ] Clear browser cache
- [ ] Open browser developer console (F12)
- [ ] Check Network tab is visible
- [ ] Ensure you have test data or can create new orders

---

## 🔍 PHASE 1: Basic Dashboard Loading

### Test 1.1: Dashboard Access
- [ ] Navigate to Café Owner Dashboard
- [ ] Page loads without errors
- [ ] No 404 errors in console
- [ ] No red errors in console

### Test 1.2: Real-Time Indicator
- [ ] See "🔄 Live Orders - Auto-Refreshing" message
- [ ] Green pulsing dot is visible
- [ ] "Last update" timestamp shows
- [ ] Active order count badge visible

### Test 1.3: Order Cards Display
- [ ] At least one order card is visible (or empty state)
- [ ] Order number badge shows (e.g., #ORD-123456)
- [ ] Meetup name and group name visible
- [ ] Date and time displayed

---

## 🧮 PHASE 2: GST Calculation Verification

### Test 2.1: Bill Breakdown Section
- [ ] "Bill Breakdown (with GST)" section visible
- [ ] Subtotal line shows
- [ ] CGST (5%) line with green background
- [ ] SGST (5%) line with green background
- [ ] Total Bill (inc. GST) shows at bottom
- [ ] All amounts are numbers (not NaN or undefined)

### Test 2.2: GST Calculation Accuracy
Create a test order with known values:
```
Example:
- Item 1: ₹100 × 1 = ₹100
- Item 2: ₹200 × 1 = ₹200
Subtotal: ₹300
CGST (5%): ₹15
SGST (5%): ₹15
Total: ₹330
```

- [ ] Subtotal = sum of item prices
- [ ] CGST = Subtotal × 5% (0.05)
- [ ] SGST = Subtotal × 5% (0.05)
- [ ] Total = Subtotal + CGST + SGST
- [ ] Math checks out correctly

---

## 💰 PHASE 3: Billing Modes

### Test 3.1: Split Billing Mode
- [ ] Blue badge shows "Split Billing"
- [ ] "Split Billing Active" header visible
- [ ] Per-person amount displayed
- [ ] Shows "Split equally among X members"
- [ ] Payment status grid visible:
  - [ ] Online payments (green)
  - [ ] Cash pending (amber)
  - [ ] Remaining balance (red/green)

### Test 3.2: Treat Mode (If Available)
- [ ] Purple badge shows "Treat Mode"
- [ ] "Treat Mode - One Person Pays All" header
- [ ] Payer name displayed
- [ ] Payment method shown (Cash/Online icon)
- [ ] Total bill amount visible
- [ ] Other members message: "No payment required – Sponsored by [Name]"

---

## 👥 PHASE 4: Member Payment Tracking

### Test 4.1: Member List (Split Mode)
- [ ] "Member Payment Status:" section visible
- [ ] List of members shown
- [ ] Each member has:
  - [ ] Name
  - [ ] Payment method icon (CreditCard/Banknote)
  - [ ] Amount
  - [ ] Status badge (Paid/Pending/Collected)

### Test 4.2: Payment Status Updates
- [ ] Online paid members show green checkmark
- [ ] Cash pending shows amber "Pending" badge
- [ ] Cash collected shows green "Collected" badge
- [ ] Amounts add up correctly

---

## 💵 PHASE 5: Café Revenue Summary

### Test 5.1: Revenue Display
- [ ] Green gradient "Café Revenue" section visible
- [ ] Total revenue amount matches total bill
- [ ] Breakdown shows: "Subtotal: ₹X + GST: ₹Y"
- [ ] GST amount = CGST + SGST

### Test 5.2: Payment Status Banner
**If Fully Paid:**
- [ ] Green banner visible
- [ ] "✅ Fully Paid - All payments received!" message
- [ ] Checkmark icon shown

**If Pending:**
- [ ] Amber banner visible
- [ ] "⏳ Pending: ₹X remaining" message
- [ ] Remaining amount matches calculation

---

## 🔄 PHASE 6: Real-Time Refresh

### Test 6.1: Auto-Refresh
- [ ] Watch "Last update" timestamp
- [ ] Timestamp updates every 3 seconds
- [ ] Orders refresh automatically
- [ ] No page flicker or jump
- [ ] Console shows "Loaded X orders from Supabase" every 3 seconds

### Test 6.2: Data Persistence
- [ ] Create a new order from GroupHome
- [ ] Wait 3 seconds
- [ ] New order appears in dashboard
- [ ] All billing data correct

---

## 🎨 PHASE 7: UI/UX Verification

### Test 7.1: Visual Design
- [ ] CafféLino brown color scheme (#be9d80, #8b5943)
- [ ] Rounded cards with proper borders
- [ ] Gradient backgrounds on billing sections
- [ ] Icons visible and colored correctly
- [ ] Text readable and properly sized

### Test 7.2: Responsive Layout
- [ ] Dashboard works on desktop
- [ ] Layout adapts to narrow screens
- [ ] No horizontal scrolling
- [ ] Text doesn't overflow
- [ ] Cards stack properly on mobile

---

## 🔧 PHASE 8: Action Buttons

### Test 8.1: Button Functionality
- [ ] "Track Payments" button visible (if applicable)
- [ ] "Collect Cash" button visible (if cash pending)
- [ ] "Complete Order" button visible
- [ ] "Cancel Order" button visible
- [ ] Buttons have correct colors and icons

### Test 8.2: Button Actions
- [ ] Click "Complete Order" - shows confirmation
- [ ] Click "Cancel Order" - shows confirmation
- [ ] Cash collection dialog opens properly
- [ ] Actions update order status

---

## 🐛 PHASE 9: Error Handling

### Test 9.1: No MeetupId Scenario
- [ ] Order without meetupId displays
- [ ] Fallback billing data shown
- [ ] No console errors
- [ ] Component doesn't hang
- [ ] Shows available order data

### Test 9.2: Network Errors
- [ ] Dashboard handles fetch failures gracefully
- [ ] Falls back to localStorage if needed
- [ ] Error messages visible (if any)
- [ ] No white screen of death

---

## 📊 PHASE 10: Data Accuracy

### Test 10.1: End-to-End Flow
1. **Create Order in GroupHome:**
   - [ ] Select items
   - [ ] Confirm order
   - [ ] Note the subtotal

2. **Check Dashboard:**
   - [ ] Order appears in dashboard
   - [ ] Subtotal matches
   - [ ] CGST = 5% of subtotal
   - [ ] SGST = 5% of subtotal
   - [ ] Total = Subtotal + 10%

3. **Verify Split Calculation:**
   - [ ] Per-person = Total ÷ Member count
   - [ ] All members show correct amounts
   - [ ] Amounts add up to total

---

## 🎯 Final Verification

### Critical Checks
- [ ] **NO 404 errors** in console
- [ ] **NO red errors** in console
- [ ] **NO "Failed to fetch"** errors
- [ ] **GST always 10% total** (5% + 5%)
- [ ] **API calls use** `/make-server-4139398a/`
- [ ] **Real-time refresh working**
- [ ] **All billing modes work**
- [ ] **All amounts are accurate**

### Success Criteria
- [ ] All 10 phases completed
- [ ] Zero console errors
- [ ] GST calculated correctly (10%)
- [ ] Dashboard loads within 2 seconds
- [ ] Auto-refresh every 3 seconds
- [ ] Split and Treat modes work
- [ ] Payment tracking accurate
- [ ] UI matches design system

---

## 📝 Test Results Summary

### Completed Tests: ____ / 10 Phases
### Passed Checks: ____ / Total
### Failed Checks: ____
### Console Errors: ____

### Status:
- [ ] ✅ ALL TESTS PASSED - READY FOR PRODUCTION
- [ ] ⚠️ MINOR ISSUES - NEEDS ATTENTION
- [ ] ❌ MAJOR ISSUES - NEEDS FIXES

---

## 🚨 Issue Reporting

If you find any issues, document:
1. **Phase/Test Number:** _____
2. **Issue Description:** _____
3. **Console Error (if any):** _____
4. **Screenshot:** _____
5. **Steps to Reproduce:** _____

---

**Testing Date:** __________
**Tested By:** __________
**Browser:** __________
**Version:** __________

---

## 📞 Quick Reference

### Expected GST Calculation:
```javascript
subtotal = sum of all item prices
cgst = subtotal * 0.05  // 5%
sgst = subtotal * 0.05  // 5%
total = subtotal + cgst + sgst  // subtotal + 10%
```

### API Endpoints:
```
GET  /make-server-4139398a/database/meetup-payments/:meetupId
GET  /make-server-4139398a/database/member-payments/:meetupId
GET  /make-server-4139398a/orders
```

### Refresh Rate:
```
Auto-refresh: Every 3 seconds
```

---

**Happy Testing!** 🎉
