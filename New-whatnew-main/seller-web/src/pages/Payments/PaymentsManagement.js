import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/payments';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import BankDetailsModal from '../../components/BankDetailsModal';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AccountBalance, AccountBalanceWallet, AccessTime, CalendarMonth, Edit, Add, CreditCard, Inbox, CheckCircle } from '@mui/icons-material';

const iosColors = {
  background: '#f7f7fa',
  card: '#fff',
  primary: '#e63946',
  secondary: '#b71c1c',
  info: '#457b9d',
  success: '#2ecc71',
  warning: '#f4a261',
  danger: '#e63946',
};

const PaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [bankDetails, setBankDetails] = useState(null);
  const [stats, setStats] = useState({
    total_earnings: 0,
    available_balance: 0,
    pending_withdrawals: 0,
    total_withdrawals: 0,
    this_month_earnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [withdrawalFormData, setWithdrawalFormData] = useState({
    bank_account_number: '',
    confirm_account_number: '',
    bank_ifsc_code: '',
    confirm_ifsc_code: '',
    bank_name: '',
    account_holder_name: '',
    mobile_number: ''
  });

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      const [paymentsData, withdrawalsData, statsData, bankDetailsData] = await Promise.all([
        paymentService.getPaymentHistory(),
        paymentService.getWithdrawalRequests(),
        paymentService.getPaymentStats(),
        paymentService.getBankDetails().catch(() => null)
      ]);
      setPayments(Array.isArray(paymentsData) ? paymentsData : (paymentsData?.results || paymentsData?.payments || []));
      setWithdrawalRequests(Array.isArray(withdrawalsData) ? withdrawalsData : (withdrawalsData?.results || withdrawalsData?.withdrawals || []));
      setStats(statsData || {});
      if (bankDetailsData && bankDetailsData.ifsc_code) {
        setBankDetails({
          ...bankDetailsData,
          ifsc_code: bankDetailsData.ifsc_code.toUpperCase()
        });
      } else {
        setBankDetails(bankDetailsData);
      }
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Failed to load payments data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalRequest = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) {
      setAlert({ type: 'danger', message: 'Please enter a valid withdrawal amount.' });
      return;
    }
    if (amount < 10000) {
      setAlert({ type: 'danger', message: 'Minimum withdrawal amount is ₹10,000.' });
      return;
    }
    if (amount > stats.available_balance) {
      setAlert({ type: 'danger', message: 'Withdrawal amount cannot exceed available balance.' });
      return;
    }
    if (!bankDetails || !bankDetails.account_number) {
      setAlert({ type: 'warning', message: 'Please add your bank details first to request withdrawal.' });
      setShowBankModal(true);
      return;
    }
    try {
      setRequesting(true);
      const withdrawalData = {
        amount,
        bank_account_number: bankDetails.account_number,
        confirm_account_number: bankDetails.account_number,
        bank_ifsc_code: bankDetails.ifsc_code.toUpperCase(),
        confirm_ifsc_code: bankDetails.ifsc_code.toUpperCase(),
        bank_name: bankDetails.bank_name,
        account_holder_name: bankDetails.account_holder_name,
        mobile_number: bankDetails.mobile_number
      };
      await paymentService.requestWithdrawal(withdrawalData);
      setAlert({
        type: 'success',
        message: 'Withdrawal request submitted successfully. It will be processed within 2-3 business days.'
      });
      setWithdrawalAmount('');
      fetchPaymentsData();
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.error || 'Failed to submit withdrawal request. Please try again.'
      });
    } finally {
      setRequesting(false);
    }
  };

  const handleFirstTimeWithdrawal = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) {
      setAlert({ type: 'danger', message: 'Please enter a valid withdrawal amount.' });
      return;
    }
    if (amount < 10000) {
      setAlert({ type: 'danger', message: 'Minimum withdrawal amount is ₹10,000.' });
      return;
    }
    if (amount > stats.available_balance) {
      setAlert({ type: 'danger', message: 'Withdrawal amount cannot exceed available balance.' });
      return;
    }
    if (withdrawalFormData.bank_account_number !== withdrawalFormData.confirm_account_number) {
      setAlert({ type: 'danger', message: 'Account numbers do not match' });
      return;
    }
    if (withdrawalFormData.bank_ifsc_code.toUpperCase() !== withdrawalFormData.confirm_ifsc_code.toUpperCase()) {
      setAlert({ type: 'danger', message: 'IFSC codes do not match' });
      return;
    }
    try {
      setRequesting(true);
      const withdrawalData = {
        amount,
        ...withdrawalFormData,
        bank_ifsc_code: withdrawalFormData.bank_ifsc_code.toUpperCase(),
        confirm_ifsc_code: withdrawalFormData.confirm_ifsc_code.toUpperCase()
      };
      await paymentService.requestWithdrawal(withdrawalData);
      setAlert({
        type: 'success',
        message: 'Withdrawal request submitted successfully. It will be processed within 2-3 business days.'
      });
      setWithdrawalAmount('');
      setShowWithdrawalForm(false);
      setWithdrawalFormData({
        bank_account_number: '',
        confirm_account_number: '',
        bank_ifsc_code: '',
        confirm_ifsc_code: '',
        bank_name: '',
        account_holder_name: '',
        mobile_number: ''
      });
      fetchPaymentsData();
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.error || 'Failed to submit withdrawal request. Please try again.'
      });
    } finally {
      setRequesting(false);
    }
  };

  const handleWithdrawalFormChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'bank_ifsc_code' || name === 'confirm_ifsc_code') {
      processedValue = value.toUpperCase();
    }
    setWithdrawalFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': case 'success': return iosColors.success;
      case 'pending': return iosColors.warning;
      case 'failed': case 'rejected': return iosColors.danger;
      case 'processing': return iosColors.info;
      default: return iosColors.secondary;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box
      sx={{
        background: iosColors.background,
        minHeight: '100vh',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically if needed
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        <Typography
          variant="h4"
          sx={{
            color: iosColors.primary,
            fontWeight: 900,
            mb: 3,
            textAlign: 'center', // Center text
          }}
        >
          Payments & Withdrawals
        </Typography>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            sx={{ mb: 3, mx: 'auto', maxWidth: 600 }}
          />
        )}

        {/* Stats Cards */}
        <Grid container spacing={2} mb={4} justifyContent="center">
          <Grid item xs={12} md={3}>
            <Card sx={{ background: iosColors.primary, color: '#fff', textAlign: 'center' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2">Total Earnings</Typography>
                    <Typography variant="h5">₹{stats.total_earnings?.toLocaleString('en-IN')}</Typography>
                  </Box>
                  <AccountBalance sx={{ fontSize: 40, opacity: 0.2 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: iosColors.success, color: '#fff', textAlign: 'center' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2">Available Balance</Typography>
                    <Typography variant="h5">₹{stats.available_balance?.toLocaleString('en-IN')}</Typography>
                  </Box>
                  <AccountBalanceWallet sx={{ fontSize: 40, opacity: 0.2 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: iosColors.warning, color: '#fff', textAlign: 'center' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2">Pending Withdrawals</Typography>
                    <Typography variant="h5">₹{stats.pending_withdrawals?.toLocaleString('en-IN')}</Typography>
                  </Box>
                  <AccessTime sx={{ fontSize: 40, opacity: 0.2 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: iosColors.info, color: '#fff', textAlign: 'center' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2">This Month</Typography>
                    <Typography variant="h5">₹{stats.this_month_earnings?.toLocaleString('en-IN')}</Typography>
                  </Box>
                  <CalendarMonth sx={{ fontSize: 40, opacity: 0.2 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Withdrawal Request */}
        <Grid container spacing={2} mb={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' ,color: iosColors.primary, fontWeight: 700 }}>
                    <AccountBalance sx={{ mr: 1, color:"black" }} />
                    Request Withdrawal
                  </Typography>
                  {bankDetails && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => setShowBankModal(true)}
                      sx={{ ml: 2 }}
                    >
                      Update Bank Details
                    </Button>
                  )}
                </Stack>

                {bankDetails && !showWithdrawalForm ? (
                  <Box component="form" onSubmit={handleWithdrawalRequest}>
                    <TextField
                      label="Withdrawal Amount (₹)"
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        inputProps: { min: 10000, max: stats.available_balance, step: 1 }
                      }}
                      fullWidth
                      required
                      sx={{ mb: 2 }}
                      helperText={`Available: ₹${stats.available_balance?.toLocaleString('en-IN')} | Minimum: ₹10,000`}
                    />
                    <Box sx={{ background: iosColors.background, borderRadius: 2, p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" mb={1}>
                        <AccountBalance sx={{ mr: 1, color: iosColors.primary }} />
                        Bank Account Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">Account Holder:</Typography>
                          <Typography fontWeight={700}>{bankDetails.account_holder_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">Bank:</Typography>
                          <Typography fontWeight={700}>{bankDetails.bank_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">Account Number:</Typography>
                          <Typography fontWeight={700}>****{bankDetails.account_number?.slice(-4)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">IFSC Code:</Typography>
                          <Typography fontWeight={700}>{bankDetails.ifsc_code}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      disabled={requesting || stats.available_balance < 10000}
                      startIcon={<AccountBalance />}
                    >
                      {requesting ? 'Processing...' : 'Request Withdrawal'}
                    </Button>
                  </Box>
                ) : !bankDetails && !showWithdrawalForm ? (
                  <Box textAlign="center" py={4}>
                    <AccountBalance sx={{ fontSize: 48, color: iosColors.primary, opacity: 0.2 }} />
                    <Typography variant="subtitle1" color="text.secondary" mt={2}>
                      No Bank Details Found
                    </Typography>
                    <Typography color="text.secondary" mb={2}>
                      Add your bank details to request withdrawals
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setShowWithdrawalForm(true)}
                      disabled={stats.available_balance < 10000}
                    >
                      Add Bank Details & Request Withdrawal
                    </Button>
                    {stats.available_balance < 10000 && (
                      <Typography color="error" mt={2} variant="caption">
                        Minimum balance of ₹10,000 required for withdrawal
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleFirstTimeWithdrawal}>
                    <TextField
                      label="Withdrawal Amount (₹)"
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        inputProps: { min: 10000, max: stats.available_balance, step: 1 }
                      }}
                      fullWidth
                      required
                      sx={{ mb: 2 }}
                      helperText={`Available: ₹${stats.available_balance?.toLocaleString('en-IN')} | Minimum: ₹10,000`}
                    />
                    <Typography variant="subtitle2" mb={2}>
                      <AccountBalance sx={{ mr: 1, color: iosColors.primary }} />
                      Bank Account Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Account Holder Name *"
                          name="account_holder_name"
                          value={withdrawalFormData.account_holder_name}
                          onChange={handleWithdrawalFormChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Bank Name *"
                          name="bank_name"
                          value={withdrawalFormData.bank_name}
                          onChange={handleWithdrawalFormChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Account Number *"
                          name="bank_account_number"
                          value={withdrawalFormData.bank_account_number}
                          onChange={handleWithdrawalFormChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Confirm Account Number *"
                          name="confirm_account_number"
                          value={withdrawalFormData.confirm_account_number}
                          onChange={handleWithdrawalFormChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="IFSC Code *"
                          name="bank_ifsc_code"
                          value={withdrawalFormData.bank_ifsc_code}
                          onChange={handleWithdrawalFormChange}
                          fullWidth
                          required
                          inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 11 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Confirm IFSC Code *"
                          name="confirm_ifsc_code"
                          value={withdrawalFormData.confirm_ifsc_code}
                          onChange={handleWithdrawalFormChange}
                          fullWidth
                          required
                          inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 11 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Mobile Number *"
                          name="mobile_number"
                          value={withdrawalFormData.mobile_number}
                          onChange={handleWithdrawalFormChange}
                          fullWidth
                          required
                          inputProps={{ maxLength: 10, pattern: '[0-9]{10}' }}
                        />
                      </Grid>
                    </Grid>
                    <Stack direction="row" spacing={2} mt={3}>
                      <Button
                        type="button"
                        variant="outlined"
                        color="secondary"
                        onClick={() => setShowWithdrawalForm(false)}
                        disabled={requesting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        disabled={requesting || stats.available_balance < 10000}
                        startIcon={<AccountBalance />}
                      >
                        {requesting ? 'Processing...' : 'Request Withdrawal'}
                      </Button>
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: iosColors.background }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{ textAlign: 'center' }}>
                  Withdrawal Information
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">Minimum withdrawal amount: ₹10,000</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">Processing time: 2-3 business days</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">Funds will be transferred to your registered bank account</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">No withdrawal fees</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Withdrawal Requests History */}
        <Card sx={{ mb: 4, mx: 'auto', maxWidth: 1200 }}>
          <CardContent>
            <Typography variant="h6" mb={2} sx={{ textAlign: 'center' }}>
              Withdrawal Requests
            </Typography>
            {withdrawalRequests.length === 0 ? (
              <Box textAlign="center" py={3}>
                <Inbox sx={{ fontSize: 48, color: iosColors.primary, opacity: 0.2 }} />
                <Typography variant="subtitle1" color="text.secondary" mt={2}>
                  No withdrawal requests
                </Typography>
                <Typography color="text.secondary">
                  Your withdrawal requests will appear here
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Request Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Processed Date</TableCell>
                      <TableCell>Bank Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {withdrawalRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{formatDate(request.created_at)}</TableCell>
                        <TableCell>
                          <Typography fontWeight={700}>₹{request.amount?.toLocaleString('en-IN')}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={request.status.toUpperCase()}
                            sx={{
                              background: getStatusColor(request.status),
                              color: '#fff',
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {request.processed_at ? formatDate(request.processed_at) : '-'}
                        </TableCell>
                        <TableCell>
                          {request.bank_details
                            ? `${request.bank_details.account_number} - ${request.bank_details.bank_name}`
                            : 'Default Account'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card sx={{ mx: 'auto', maxWidth: 1200 }}>
          <CardContent>
            <Typography variant="h6" mb={2} sx={{ textAlign: 'center' }}>
              Payment History
            </Typography>
            {payments.length === 0 ? (
              <Box textAlign="center" py={3}>
                <CreditCard sx={{ fontSize: 48, color: iosColors.primary, opacity: 0.2 }} />
                <Typography variant="subtitle1" color="text.secondary" mt={2}>
                  No payments received
                </Typography>
                <Typography color="text.secondary">
                  Payments from your livestream sales will appear here
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Payment ID</TableCell>
                      <TableCell>Buyer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment Method</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.created_at)}</TableCell>
                        <TableCell>
                          <Typography fontFamily="monospace">#{payment.id || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>{payment.buyer_name}</TableCell>
                        <TableCell>
                          <Typography fontWeight={700}>₹{payment.amount?.toLocaleString('en-IN')}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status.toUpperCase()}
                            sx={{
                              background: getStatusColor(payment.status),
                              color: '#fff',
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.payment_method || 'Razorpay'}
                            sx={{
                              background: iosColors.background,
                              color: '#222',
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Bank Details Modal */}
        <BankDetailsModal
          show={showBankModal}
          onHide={() => setShowBankModal(false)}
          bankDetails={bankDetails}
          onUpdate={fetchPaymentsData}
        />
      </Box>
    </Box>
  );
};

export default PaymentsManagement;
