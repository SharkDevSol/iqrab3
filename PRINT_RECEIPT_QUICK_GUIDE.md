# 🖨️ Print Receipt - Quick Guide

## ✅ System Ready!

Backend server is running on port 5000 with receipt printing enabled.

---

## 🚀 3-Step Quick Start

### 1️⃣ Navigate
```
Finance → Monthly Payments → Select Class → View Student Details
```

### 2️⃣ Find Paid Invoice
Look for invoices with **green "Paid Amount"** > 0

### 3️⃣ Click Print
Click the **🖨️ Print** button in the last column

---

## 📋 Receipt Includes

✅ Receipt Number (auto: 000001, 000002...)  
✅ Date  
✅ Student Name, ID, Class  
✅ Month Paid  
✅ Amount in Words  
✅ Amount in Figures  
✅ School Info (bilingual)  
✅ Professional Layout  

---

## 🎯 Quick Tips

- **Print Button**: Only shows on paid invoices
- **Receipt Number**: Auto-increments with each print
- **Save PDF**: Use browser's "Save as PDF" option
- **Reprint**: Can print same invoice multiple times
- **School Logo**: Optional (place in `backend/uploads/branding/`)

---

## ⚡ Troubleshooting

**No Print Button?**  
→ Invoice must have paid amount > 0

**Student Name "Unknown"?**  
→ Normal if student data missing, receipt still prints

**Receipt Number Not Incrementing?**  
→ Check `backend/uploads/receipt-counter.json` exists

---

## ✅ Status

- Backend: ✅ Running (Port 5000)
- Frontend: ✅ Ready
- Print System: ✅ Operational
- Receipt Counter: ✅ Initialized

---

**Ready to print receipts now!** 🎉
