import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/payments';
import { authService } from '../../services/auth';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  MonetizationOn,
  Wallet,
  Info as InfoIcon,
  CheckCircle,
  AccessTime,
  FlashOn,
  Star,
  GridOn,
  AddShoppingCart,
  CreditCard,
  Inbox,
  Cancel,
  Assignment,
  TrendingUp,
  History,
  Download,
  Search,
  Clear,
  Warning,
  PlayCircle,
  CartPlus,
  Eye,
} from '@mui/icons-material';

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

const CreditsManagement = ({ refreshUser }) => {
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [creditPackage, setCreditPackage] = useState(1);
  const [isFirstPurchase, setIsFirstPurchase] = useState(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Usage history states
  const [showUsageHistory, setShowUsageHistory] = useState(false);
  const [usageHistory, setUsageHistory] = useState([]);
  const [loadingUsage, setLoadingUsage] = useState(false);

  const creditPackages = [
    // Regular packages
    { Plan_Name:'Starter', credits: 7, price: 99, original_price: 99, dis: '0%', popular: false, tag: 'Entry Pack' },
    { Plan_Name:'Value', credits: 21, price: 199, original_price: 297, dis: '33%', popular: false, tag: 'Value Pack' },
    { Plan_Name:'Saver', credits: 45, price: 399, original_price: 636, dis: '48%', popular: true, tag: 'Popular' },
    { Plan_Name:'Pro', credits: 78, price: 699, original_price: 1103, dis: '37%', popular: false, tag: 'Pro Pack' },
    { Plan_Name:'Mega', credits: 150, price: 999, original_price: 2121, dis: '53%', popular: false, tag: 'Best value' }
  ];

  const firstPurchaseOffer = [
    // Only show these packages for the first purchase
    { Plan_Name:'Starter', credits: 13, price: 99, original_price: 99, dis: '0%', popular: false, tag: 'First Purchase' },
    { Plan_Name:'Value', credits: 54, price: 299, original_price: 636, dis: '53%', popular: false, tag: 'First Purchase' },
  ];

  useEffect(() => {
    fetchCreditsData();
  }, []);

  // Search and filter functions
  useEffect(() => {
    filterTransactions();
  }, [searchTerm, filterStatus, filterType, dateRange, transactions]);

  const filterTransactions = () => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === filterStatus);
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(transaction => transaction.transaction_type === filterType);
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.created_at) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.created_at) <= new Date(dateRange.end + 'T23:59:59')
      );
    }

    setFilteredTransactions(filtered);
  };

  const fetchCreditsData = async () => {
    try {
      setLoading(true);
      const [creditsData, transactionsData] = await Promise.all([
        paymentService.getSellerCredits(),
        paymentService.getCreditTransactions()
      ]);
      setCredits(creditsData.credits);
      const transactionsList = transactionsData.transactions || [];
      setTransactions(transactionsList);
      setFilteredTransactions(transactionsList);
      
      // Check if user has made any previous purchases
      const hasPreviousPurchases = transactionsList.some(
        transaction => transaction.transaction_type === 'purchase' && transaction.status === 'completed'
      );
      setIsFirstPurchase(!hasPreviousPurchases);
      
      // Set default package based on purchase history
      if (!hasPreviousPurchases && firstPurchaseOffer.length > 0) {
        setCreditPackage(firstPurchaseOffer[0].credits);
      } else {
        setCreditPackage(creditPackages[0].credits);
      }
    } catch (error) {
      console.error('Error fetching credits data:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to load credits data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageHistory = async () => {
    try {
      setLoadingUsage(true);
      // This would be a new API endpoint for usage history
      const response = await paymentService.getUsageHistory();
      setUsageHistory(response.usage_history || []);
    } catch (error) {
      console.error('Error fetching usage history:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to load usage history. Please try again.'
      });
    } finally {
      setLoadingUsage(false);
    }
  };

  const downloadInvoice = async (transaction) => {
    try {
      if (transaction.transaction_type !== 'purchase' || transaction.status !== 'completed') {
        setAlert({
          type: 'warning',
          message: 'Invoice is only available for completed purchases.'
        });
        return;
      }

      const response = await paymentService.downloadInvoice(transaction.id);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${transaction.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to download invoice. Please try again.'
      });
    }
  };

  const viewInvoice = async (transaction) => {
    try {
      if (transaction.transaction_type !== 'purchase' || transaction.status !== 'completed') {
        setAlert({
          type: 'warning',
          message: 'Invoice is only available for completed purchases.'
        });
        return;
      }

      const invoiceUrl = `${paymentService.getBaseURL()}/api/payments/invoice/${transaction.id}/view/`;
      window.open(invoiceUrl, '_blank');
    } catch (error) {
      console.error('Error viewing invoice:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to view invoice. Please try again.'
      });
    }
  };

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      setAlert({
        type: 'warning',
        message: 'No transactions to export.'
      });
      return;
    }

    const headers = ['Date', 'Type', 'Credits', 'Amount', 'Status', 'Description', 'Payment ID'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(transaction => [
        formatDate(transaction.created_at),
        transaction.transaction_type === 'purchase' ? 'Purchase' : 'Usage',
        transaction.credits,
        transaction.amount || '',
        transaction.status,
        `"${transaction.description || ''}"`,
        transaction.razorpay_payment_id || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `credit-transactions-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await paymentService.downloadReport({
        start_date: dateRange.start,
        end_date: dateRange.end,
        status: filterStatus,
        type: filterType
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `credit-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to download report. Please try again.'
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterType('all');
    setDateRange({ start: '', end: '' });
  };

  const handlePurchaseCredits = async () => {
    try {
      setPurchasing(true);
      
      // Find selected package from both regular and first purchase offers
      let selectedPackage = creditPackages.find(pkg => pkg.credits === creditPackage);
      if (!selectedPackage && isFirstPurchase) {
        selectedPackage = firstPurchaseOffer.find(pkg => pkg.credits === creditPackage);
      }
      
      if (!selectedPackage) {
        setAlert({
          type: 'danger',
          message: 'Please select a valid credit package.'
        });
        return;
      }
      
      const response = await paymentService.purchaseCredits({
        credits: selectedPackage.credits,
        amount: selectedPackage.price
      });

      console.log('Purchase credits response:', response);
      console.log('Selected package:', selectedPackage);

      if (response.razorpay_order_id) {
        // Check if Razorpay is loaded
        if (typeof window.Razorpay === 'undefined') {
          setAlert({
            type: 'danger',
            message: 'Payment system is loading. Please try again in a moment.'
          });
          return;
        }

        // Get current user for prefill
        const currentUser = await authService.getCurrentUser();

        // Initialize Razorpay payment
        const options = {
          key: response.key,
          amount: response.amount * 100,
          currency: response.currency,
          order_id: response.razorpay_order_id,
          name: 'WhatNew Credits',
          description: `Purchase ${selectedPackage.credits} Credits`,
          image: '/logo192.png',
          prefill: {
            name: currentUser?.user?.get_full_name || currentUser?.user?.username || '',
            email: currentUser?.user?.email || '',
            contact: currentUser?.user?.phone_number || ''
          },
          theme: {
            color: '#007bff'
          },
          handler: async function (razorpayResponse) {
            console.log('Razorpay payment successful:', razorpayResponse);
            try {
              // Verify payment with backend
              const verifyResponse = await paymentService.verifyPayment({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature
              });

              console.log('Payment verification response:', verifyResponse);

              setAlert({
                type: 'success',
                message: verifyResponse.message || `Successfully purchased ${selectedPackage.credits} credits!`
              });

              // Refresh data
              fetchCreditsData();
              
              // Refresh user data to update navbar
              if (refreshUser) {
                refreshUser();
              }
            } catch (verifyError) {
              console.error('Payment verification failed:', verifyError);
              setAlert({
                type: 'danger',
                message: 'Payment completed but verification failed. Please contact support if credits are not added.'
              });
            }
          },
          modal: {
            ondismiss: async function() {
              console.log('Razorpay payment modal dismissed');
              try {
                // Handle payment failure/cancellation
                await paymentService.handlePaymentFailure({
                  razorpay_order_id: response.razorpay_order_id,
                  error_reason: 'Payment cancelled by user'
                });
              } catch (error) {
                console.error('Error handling payment cancellation:', error);
              }
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        
        razorpay.on('payment.failed', async function (response) {
          console.error('Razorpay payment failed:', response.error);
          try {
            // Handle payment failure
            await paymentService.handlePaymentFailure({
              razorpay_order_id: response.error.metadata?.order_id,
              razorpay_payment_id: response.error.metadata?.payment_id,
              error_reason: response.error.description
            });
          } catch (error) {
            console.error('Error handling payment failure:', error);
          }
          
          setAlert({
            type: 'danger',
            message: `Payment failed: ${response.error.description}`
          });
        });

        razorpay.open();
      } else {
        setAlert({
          type: 'success',
          message: `Successfully purchased ${selectedPackage.credits} credits!`
        });
        fetchCreditsData();
        
        // Refresh user data to update navbar
        if (refreshUser) {
          refreshUser();
        }
      }
    } catch (error) {
      console.error('Error purchasing credits:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setAlert({
        type: 'danger',
        message: error.response?.data?.error || error.response?.data?.message || 'Failed to purchase credits. Please try again.'
      });
    } finally {
      setPurchasing(false);
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
    <Box sx={{ background: iosColors.background, minHeight: '100vh', p: { xs: 1, md: 3 } }}>
      <Grid container spacing={3}>
        {/* Header and Balance */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title={
                <Typography variant="h5" sx={{ color: iosColors.primary, fontWeight: 700 }}>
                  <MonetizationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Credits Management
                </Typography>
              }
              subheader="Manage your livestream credits and track usage"
              sx={{ background: iosColors.card, pb: 0 }}
            />
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
                <Chip
                  icon={<Wallet />}
                  label={`${credits} Credits`}
                  color="primary"
                  sx={{ fontSize: '1.1rem', px: 2, py: 1, fontWeight: 700 }}
                />
                <Box textAlign={{ xs: 'left', md: 'right' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Current Balance
                  </Typography>
                  <Typography color="success.main" fontWeight={700}>
                    ₹{(credits * 10).toFixed(2)} Value
                  </Typography>
                </Box>
              </Stack>
              {alert && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                  sx={{ mb: 2 }}
                />
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardHeader
                      avatar={<InfoIcon color="info" />}
                      title="How Credits Work"
                      sx={{ pb: 0 }}
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CheckCircle color="success" fontSize="small" />
                          <Typography variant="body2">Free credit on registration</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccessTime color="primary" fontSize="small" />
                          <Typography variant="body2">1 credit per 30 minutes of livestreaming</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Star color="warning" fontSize="small" />
                          <Typography variant="body2">Credits never expire</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <FlashOn color="error" fontSize="small" />
                          <Typography variant="body2">Instant activation after purchase</Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ mb: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <CardContent>
                      <Wallet sx={{ fontSize: 48, color: iosColors.primary, mb: 1 }} />
                      <Typography variant="h6" color="primary">Current Balance</Typography>
                      <Typography variant="h3" color="primary" fontWeight={700}>{credits}</Typography>
                      <Typography color="text.secondary" mb={2}>Credits Available</Typography>
                      {credits === 0 ? (
                        <Alert type="warning" message="No credits left! Purchase credits to start livestreaming." />
                      ) : (
                        <Alert type="success" message={`Ready to stream! ~${Math.floor(credits * 0.5)} hours available`} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Purchase Credits */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AddShoppingCart />
                  <Typography variant="h6">Purchase Credits</Typography>
                  {isFirstPurchase && (
                    <Chip
                      label="First Purchase Special!"
                      color="warning"
                      icon={<Star />}
                      sx={{ fontWeight: 700, ml: 2, animation: 'pulseSpecial 1.8s infinite' }}
                    />
                  )}
                </Stack>
              }
              sx={{ background: iosColors.card, pb: 0 }}
            />
            <CardContent>
              {isFirstPurchase && firstPurchaseOffer.length > 0 && (
                <>
                  <Alert
                    type="info"
                    message="🎉 Special First Purchase Offers! Get extra credits on your first purchase - limited time only!"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="subtitle1" color="warning.main" fontWeight={700} mb={2}>
                    <Star sx={{ mr: 1 }} />
                    First Purchase Special Offers
                  </Typography>
                  <Grid container spacing={2} mb={2}>
                    {firstPurchaseOffer.map((pkg) => (
                      <Grid item xs={12} sm={6} key={`first-${pkg.credits}`}>
                        <Card
                          variant={creditPackage === pkg.credits ? "outlined" : "elevation"}
                          sx={{
                            borderColor: creditPackage === pkg.credits ? iosColors.primary : iosColors.warning,
                            boxShadow: creditPackage === pkg.credits ? `0 0 0 2px ${iosColors.primary}` : 1,
                            background: iosColors.card,
                            cursor: 'pointer',
                            transition: 'box-shadow 0.2s, border-color 0.2s',
                            '&:hover': {
                              boxShadow: `0 4px 16px ${iosColors.primary}22`,
                              borderColor: iosColors.primary,
                            }
                          }}
                          onClick={() => setCreditPackage(pkg.credits)}
                        >
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Chip label={pkg.tag} color="warning" sx={{ mb: 1 }} />
                            <Typography variant="h6" color="warning.main" fontWeight={700}>{pkg.Plan_Name}</Typography>
                            <Typography variant="h4" color="text.primary" fontWeight={700}>{pkg.credits} <small>Credits</small></Typography>
                            <Typography variant="h5" color="success.main">₹{pkg.price}</Typography>
                            {pkg.original_price > pkg.price && (
                              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                ₹{pkg.original_price}
                              </Typography>
                            )}
                            {pkg.dis !== '0%' && (
                              <Chip label={`${pkg.dis} OFF`} color="success" sx={{ mt: 1 }} />
                            )}
                            <Button
                              variant={creditPackage === pkg.credits ? "contained" : "outlined"}
                              color="warning"
                              fullWidth
                              sx={{ mt: 2, fontWeight: 700 }}
                              startIcon={creditPackage === pkg.credits ? <CheckCircle /> : <AddShoppingCart />}
                            >
                              {creditPackage === pkg.credits ? "Selected" : "Select Offer"}
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Typography variant="subtitle1" color="secondary" fontWeight={700} mb={2}>
                    <GridOn sx={{ mr: 1 }} />
                    Regular Plans
                  </Typography>
                </>
              )}
              <Grid container spacing={2}>
                {creditPackages.map((pkg) => (
                  <Grid item xs={12} sm={6} md={4} key={pkg.credits}>
                    <Card
                      variant={creditPackage === pkg.credits ? "outlined" : "elevation"}
                      sx={{
                        borderColor: creditPackage === pkg.credits ? iosColors.primary : '#ececec',
                        boxShadow: creditPackage === pkg.credits ? `0 0 0 2px ${iosColors.primary}` : 1,
                        background: iosColors.card,
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border-color 0.2s',
                        '&:hover': {
                          boxShadow: `0 4px 16px ${iosColors.primary}22`,
                          borderColor: iosColors.primary,
                        }
                      }}
                      onClick={() => setCreditPackage(pkg.credits)}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Chip label={pkg.tag} color={pkg.popular ? "primary" : "secondary"} sx={{ mb: 1 }} />
                        <Typography variant="h6" color="primary" fontWeight={700}>{pkg.Plan_Name}</Typography>
                        <Typography variant="h4" color="text.primary" fontWeight={700}>{pkg.credits} <small>Credits</small></Typography>
                        <Typography variant="h5" color="success.main">₹{pkg.price}</Typography>
                        {pkg.original_price > pkg.price && (
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            ₹{pkg.original_price}
                          </Typography>
                        )}
                        {pkg.dis !== '0%' && (
                          <Chip label={`${pkg.dis} OFF`} color="success" sx={{ mt: 1 }} />
                        )}
                        <Button
                          variant={creditPackage === pkg.credits ? "contained" : "outlined"}
                          color="primary"
                          fullWidth
                          sx={{ mt: 2, fontWeight: 700 }}
                          startIcon={creditPackage === pkg.credits ? <CheckCircle /> : <AddShoppingCart />}
                        >
                          {creditPackage === pkg.credits ? "Selected" : "Select Plan"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box textAlign="center" mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<CreditCard />}
                  onClick={handlePurchaseCredits}
                  disabled={purchasing}
                  sx={{ px: 5, py: 2, fontWeight: 700 }}
                >
                  {purchasing ? "Processing..." : `Purchase ${creditPackage} Credits for ₹${
                    (() => {
                      let pkg = creditPackages.find(p => p.credits === creditPackage);
                      if (!pkg && isFirstPurchase) {
                        pkg = firstPurchaseOffer.find(p => p.credits === creditPackage);
                      }
                      return pkg?.price || 0;
                    })()
                  }`}
                  {isFirstPurchase && firstPurchaseOffer.find(p => p.credits === creditPackage) && (
                    <Chip label="Special Offer!" color="warning" sx={{ ml: 2 }} />
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Transaction History */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Assignment />
                  <Typography variant="h6">Transaction History</Typography>
                  <Chip label={filteredTransactions.length} color="default" sx={{ ml: 2 }} />
                </Stack>
              }
              sx={{ background: iosColors.card, pb: 0 }}
            />
            <CardContent>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Search"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={clearFilters}>
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    displayEmpty
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    displayEmpty
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="purchase">Purchase</MenuItem>
                    <MenuItem value="usage">Usage</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="From"
                    type="date"
                    size="small"
                    fullWidth
                    value={dateRange.start}
                    onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="To"
                    type="date"
                    size="small"
                    fullWidth
                    value={dateRange.end}
                    onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={clearFilters}
                    startIcon={<Clear />}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
              {filteredTransactions.length === 0 ? (
                <Box textAlign="center" py={5}>
                  <Inbox sx={{ fontSize: 48, color: iosColors.primary, opacity: 0.2 }} />
                  <Typography variant="h6" color="text.secondary" mt={2}>
                    {transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filters'}
                  </Typography>
                  <Typography color="text.secondary" mb={2}>
                    {transactions.length === 0
                      ? 'Your credit purchase and usage history will appear here'
                      : 'Try adjusting your search criteria or clearing filters'
                    }
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Credits</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(transaction.created_at)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={transaction.transaction_type === 'purchase' ? <AddShoppingCart /> : <FlashOn />}
                              label={transaction.transaction_type === 'purchase' ? 'Purchase' : 'Usage'}
                              color={transaction.transaction_type === 'purchase' ? "success" : "info"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={700} color={transaction.transaction_type === 'purchase' ? "success.main" : "info.main"}>
                              {transaction.transaction_type === 'purchase' ? '+' : '-'}
                              {transaction.credits}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {transaction.amount ? (
                              <Typography fontWeight={700}>₹{transaction.amount}</Typography>
                            ) : (
                              <Typography color="text.secondary">-</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={
                                transaction.status === 'completed'
                                  ? <CheckCircle />
                                  : transaction.status === 'pending'
                                  ? <AccessTime />
                                  : <Cancel />
                              }
                              label={transaction.status}
                              color={
                                transaction.status === 'completed'
                                  ? "success"
                                  : transaction.status === 'pending'
                                  ? "warning"
                                  : "error"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {transaction.description}
                            </Typography>
                            {transaction.razorpay_payment_id && (
                              <Typography variant="caption" color="text.secondary">
                                ID: {transaction.razorpay_payment_id}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              {transaction.transaction_type === 'purchase' && transaction.status === 'completed' && (
                                <>
                                  <IconButton
                                    color="primary"
                                    onClick={() => viewInvoice(transaction)}
                                    title="View Invoice"
                                  >
                                    <Eye />
                                  </IconButton>
                                  <IconButton
                                    color="success"
                                    onClick={() => downloadInvoice(transaction)}
                                    title="Download Invoice"
                                  >
                                    <Download />
                                  </IconButton>
                                </>
                              )}
                              {transaction.status === 'failed' && (
                                <Chip
                                  icon={<Warning />}
                                  label="Payment Failed"
                                  color="error"
                                  size="small"
                                />
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Usage History Modal */}
      <Dialog
        open={showUsageHistory}
        onClose={() => setShowUsageHistory(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
          Usage History
        </DialogTitle>
        <DialogContent>
          {loadingUsage ? (
            <Box textAlign="center" py={4}>
              <LoadingSpinner />
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {/* Usage history content would go here */}
              Detailed usage analytics and patterns will be displayed here.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUsageHistory(false)} color="secondary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreditsManagement;
