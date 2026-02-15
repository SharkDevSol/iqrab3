import { useState, useEffect } from 'react';
import styles from './MonthlyPaymentsImproved.module.css';
import api from '../../utils/api';

const MonthlyPaymentsImproved = () => {
  const [overview, setOverview] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMultiMonthModal, setShowMultiMonthModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [currentEthiopianMonth, setCurrentEthiopianMonth] = useState(5); // Tir = 5
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'CASH',
    paymentDate: new Date().toISOString().split('T')[0],
    reference: '',
    notes: ''
  });
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterMonth, setFilterMonth] = useState('ALL');

  const ethiopianMonths = [
    'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
    'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
  ];

  const paymentMethods = [
    { value: 'CASH', label: 'Cash', requiresReference: false },
    { value: 'CBE', label: 'CBE Bank', requiresReference: true },
    { value: 'ABAY', label: 'Abay Bank', requiresReference: true },
    { value: 'ABYSSINIA', label: 'Abyssinia Bank', requiresReference: true },
    { value: 'EBIRR', label: 'E-Birr', requiresReference: true }
  ];

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchClassDetails();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentDetails();
    }
  }, [selectedStudent]);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const response = await api.get('/finance/monthly-payments-view/overview');
      setOverview(response.data);
    } catch (error) {
      console.error('Error fetching overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/finance/monthly-payments-view/class/${selectedClass}`);
      setClassDetails(response.data);
    } catch (error) {
      console.error('Error fetching class details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/finance/monthly-payments-view/student/${selectedStudent}`);
      setStudentDetails(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const isMonthUnlocked = (monthNumber) => {
    return monthNumber <= currentEthiopianMonth;
  };

  const canPayMonth = (invoice, allInvoices) => {
    // Can't pay if month is locked
    if (!isMonthUnlocked(invoice.monthNumber)) {
      return { canPay: false, reason: 'Month not yet unlocked' };
    }

    // Can't pay if already paid
    if (invoice.status === 'PAID') {
      return { canPay: false, reason: 'Already paid' };
    }

    // Check if all previous months are paid
    const previousMonths = allInvoices.filter(inv => inv.monthNumber < invoice.monthNumber);
    const unpaidPrevious = previousMonths.find(inv => inv.status !== 'PAID');
    
    if (unpaidPrevious) {
      return { canPay: false, reason: `Must pay ${unpaidPrevious.month} first` };
    }

    return { canPay: true, reason: '' };
  };

  const handleRecordPayment = (invoice) => {
    const paymentCheck = canPayMonth(invoice, studentDetails.invoices);
    if (!paymentCheck.canPay) {
      alert(paymentCheck.reason);
      return;
    }

    setSelectedInvoice(invoice);
    setPaymentForm({
      amount: invoice.balance.toFixed(2),
      paymentMethod: 'CASH',
      paymentDate: new Date().toISOString().split('T')[0],
      reference: '',
      notes: ''
    });
    setShowPaymentModal(true);
  };

  const handleMultiMonthPayment = () => {
    const unlockedUnpaidInvoices = studentDetails.invoices
      .filter(inv => isMonthUnlocked(inv.monthNumber) && inv.status !== 'PAID')
      .sort((a, b) => a.monthNumber - b.monthNumber);

    if (unlockedUnpaidInvoices.length === 0) {
      alert('No unpaid months available');
      return;
    }

    // Check sequential payment requirement
    const firstUnpaid = unlockedUnpaidInvoices[0];
    const paymentCheck = canPayMonth(firstUnpaid, studentDetails.invoices);
    if (!paymentCheck.canPay) {
      alert(paymentCheck.reason);
      return;
    }

    // Get consecutive unpaid months starting from first unpaid
    const consecutiveMonths = [];
    for (let i = 0; i < unlockedUnpaidInvoices.length; i++) {
      const invoice = unlockedUnpaidInvoices[i];
      if (i === 0 || invoice.monthNumber === unlockedUnpaidInvoices[i-1].monthNumber + 1) {
        consecutiveMonths.push(invoice);
      } else {
        break;
      }
    }

    setSelectedMonths(consecutiveMonths.map(inv => inv.id));
    const totalAmount = consecutiveMonths.reduce((sum, inv) => sum + inv.balance, 0);
    
    setPaymentForm({
      amount: totalAmount.toFixed(2),
      paymentMethod: 'CASH',
      paymentDate: new Date().toISOString().split('T')[0],
      reference: '',
      notes: ''
    });
    setShowMultiMonthModal(true);
  };

  const validateReference = async (reference, paymentMethod) => {
    if (paymentMethod === 'CASH') return true;
    if (!reference) return false;

    try {
      const response = await api.get(`/finance/payments/check-reference/${reference}`);
      return !response.data.exists;
    } catch (error) {
      console.error('Error validating reference:', error);
      return true;
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    const selectedMethod = paymentMethods.find(m => m.value === paymentForm.paymentMethod);
    if (selectedMethod.requiresReference && !paymentForm.reference) {
      alert('Reference number is required for this payment method');
      return;
    }

    if (selectedMethod.requiresReference) {
      const isValid = await validateReference(paymentForm.reference, paymentForm.paymentMethod);
      if (!isValid) {
        alert('This reference number has already been used. Please use a unique reference number.');
        return;
      }
    }

    try {
      await api.post('/finance/payments', {
        invoiceId: selectedInvoice.id,
        amount: parseFloat(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        paymentDate: new Date(paymentForm.paymentDate).toISOString(),
        reference: selectedMethod.requiresReference ? paymentForm.reference : null,
        notes: paymentForm.notes || null
      });
      
      alert('Payment recorded successfully!');
      setShowPaymentModal(false);
      setSelectedInvoice(null);
      
      await fetchStudentDetails();
      await fetchClassDetails();
      await fetchOverview();
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmitMultiMonthPayment = async (e) => {
    e.preventDefault();

    const selectedMethod = paymentMethods.find(m => m.value === paymentForm.paymentMethod);
    if (selectedMethod.requiresReference && !paymentForm.reference) {
      alert('Reference number is required for this payment method');
      return;
    }

    if (selectedMethod.requiresReference) {
      const isValid = await validateReference(paymentForm.reference, paymentForm.paymentMethod);
      if (!isValid) {
        alert('This reference number has already been used. Please use a unique reference number.');
        return;
      }
    }

    try {
      const invoicesToPay = studentDetails.invoices
        .filter(inv => selectedMonths.includes(inv.id))
        .sort((a, b) => a.monthNumber - b.monthNumber);

      for (const invoice of invoicesToPay) {
        await api.post('/finance/payments', {
          invoiceId: invoice.id,
          amount: invoice.balance,
          paymentMethod: paymentForm.paymentMethod,
          paymentDate: new Date(paymentForm.paymentDate).toISOString(),
          reference: selectedMethod.requiresReference ? `${paymentForm.reference}-M${invoice.monthNumber}` : null,
          notes: paymentForm.notes || `Multi-month payment for ${invoice.month}`
        });
      }
      
      alert(`Payment recorded successfully for ${invoicesToPay.length} months!`);
      setShowMultiMonthModal(false);
      setSelectedMonths([]);
      
      await fetchStudentDetails();
      await fetchClassDetails();
      await fetchOverview();
    } catch (error) {
      console.error('Error recording multi-month payment:', error);
      alert('Failed to record payment: ' + (error.response?.data?.message || error.message));
    }
  };
