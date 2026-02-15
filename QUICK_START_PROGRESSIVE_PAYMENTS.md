# Quick Start: Progressive Monthly Payments

## 🚀 Get Started in 3 Steps

### Step 1: Delete Old Data (Optional)
If you want to start fresh:
```bash
cd backend
node scripts/delete-all-finance-data.js
```

### Step 2: Create Class Fee with Multiple Months
1. Open your app → **Finance** → **Payment Settings**
2. Click **"+ Add Class Fee"**
3. Select:
   - Class: "Class A"
   - Monthly Fee: 1300
   - **Check the months**: ✅ Sep, Oct, Nov, Dec, Jan, Feb, Mar, Apr, May, Jun (10 months)
4. Click **"Add Class Fee"**

### Step 3: Generate First Month
1. Find your class card in **Payment Settings**
2. Click **"📄 Generate Next Month"**
3. Confirm → September invoices created! ✅

## 📅 Monthly Routine

**At the end of each month:**
1. Go to **Payment Settings**
2. Click **"📄 Generate Next Month"**
3. Done! Next month's invoices are created

## 💡 Key Features

### ✅ Progressive Generation
- Month 1: Generate September → Students see 1 invoice
- Month 2: Generate October → Students see 2 invoices
- Month 3: Generate November → Students see 3 invoices
- ...and so on

### ✅ Flexible Payment
Students can pay:
- **Single month**: $1300
- **Multiple months**: $2600, $3900, etc.

### ✅ Clear Tracking
- Each month has its own invoice
- Easy to see paid/unpaid months
- Automatic late fees (if configured)

## 📊 View Payments

Go to **Finance** → **Monthly Payments** to see:
- Current invoices
- Payment status
- Student payment history

## 🎯 Example: 10-Month Plan

**Setup:**
- Class A: $1300/month
- Months: Sep, Oct, Nov, Dec, Jan, Feb, Mar, Apr, May, Jun

**Timeline:**
- **September 1**: Generate Sep invoices → Students pay $1300
- **October 1**: Generate Oct invoices → Students pay $1300
- **November 1**: Generate Nov invoices → Students pay $1300
- ...continue monthly

**Total**: 10 months × $1300 = $13,000 per student

## ❓ FAQ

**Q: Can I generate all months at once?**
A: No, the system generates one month at a time. This gives you better control and doesn't overwhelm students.

**Q: What if a student wants to pay 3 months in advance?**
A: They can! Use the "Pay Multiple Months" button in Monthly Payments page.

**Q: Can I skip a month?**
A: Yes, just don't generate that month's invoices. The system will move to the next selected month.

**Q: What happens after all 10 months are generated?**
A: The button will show "All months generated" and you can't generate more. Students can still pay pending invoices.

## 🔧 Troubleshooting

**"No students found"**
→ Make sure students are registered in the class

**"All months generated"**
→ You've created all 10 months already

**"No months configured"**
→ Delete and recreate the fee structure with month selection

## 📚 Full Documentation

For detailed information, see: `PROGRESSIVE_MONTHLY_PAYMENT_GUIDE.md`
