import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orders';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close, Visibility, LocalShipping, CheckCircle, Cancel, Info as InfoIcon } from '@mui/icons-material';

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

const OrdersManagement = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [shippingData, setShippingData] = useState({
    tracking_id: '',
    courier_name: ''
  });
  const [showShippingForm, setShowShippingForm] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getSellerOrders();
      const ordersArray = Array.isArray(response) ? response : (response?.results || response?.orders || []);
      setOrders(ordersArray);
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Failed to load orders. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.buyer_name && order.buyer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.items && order.items.some(item =>
          item.product_name && item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId, newStatus, trackingData = null) => {
    try {
      let statusData = {
        status: newStatus,
        notes: `Status updated to ${newStatus.replace('_', ' ')}`
      };

      if (newStatus === 'shipped' && trackingData) {
        statusData.tracking_id = trackingData.tracking_id;
        statusData.courier_name = trackingData.courier_name;
        statusData.notes = `Order shipped via ${trackingData.courier_name}. Tracking ID: ${trackingData.tracking_id}. Estimated delivery: 7-10 business days.`;
      }

      await orderService.updateOrderStatus(orderId, statusData);

      setAlert({
        type: 'success',
        message: newStatus === 'shipped'
          ? `Order marked as shipped. Customer has been notified with tracking details.`
          : `Order status updated to ${newStatus.replace('_', ' ')}`
      });

      setShippingData({ tracking_id: '', courier_name: '' });
      setShowShippingForm(false);

      fetchOrders();
      setShowModal(false);
    } catch (error) {
      let errorMessage = 'Failed to update order status. Please try again.';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Please log in again to continue.';
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
          case 403:
            errorMessage = 'You do not have permission to update this order.';
            break;
          case 404:
            errorMessage = 'Order not found or you cannot update this order (payment not completed).';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later or contact support.';
            break;
          default:
            errorMessage = error.response.data?.error || 'Failed to update order status.';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      setAlert({
        type: 'danger',
        message: errorMessage
      });
    }
  };

  const handleShippingSubmit = () => {
    if (!shippingData.tracking_id.trim()) {
      setAlert({
        type: 'danger',
        message: 'Please enter a tracking ID'
      });
      return;
    }

    if (!shippingData.courier_name.trim()) {
      setAlert({
        type: 'danger',
        message: 'Please enter a courier name'
      });
      return;
    }

    handleStatusUpdate(selectedOrder.id, 'shipped', shippingData);
  };

  const handleStatusClick = (status) => {
    if (status === 'shipped') {
      setShowShippingForm(true);
    } else {
      handleStatusUpdate(selectedOrder.id, status);
    }
  };

  const getAvailableStatusTransitions = (currentStatus) => {
    const transitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['processing', 'shipped', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered', 'cancelled'],
      'delivered': [],
      'cancelled': []
    };

    return transitions[currentStatus] || [];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return iosColors.warning;
      case 'confirmed': return iosColors.info;
      case 'shipped': return iosColors.primary;
      case 'delivered': return iosColors.success;
      case 'cancelled': return iosColors.danger;
      default: return '#888';
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'completed': return iosColors.success;
      case 'pending': return iosColors.warning;
      case 'failed': return iosColors.danger;
      case 'refunded': return iosColors.info;
      default: return '#888';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const calculateOrderTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const itemTotal = item.total_price || (item.unit_price || item.price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ background: iosColors.background, minHeight: '100vh', p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Grid item>
          <Typography variant="h4" sx={{ color: iosColors.primary, fontWeight: 900 }}>
            Orders Management
          </Typography>
          <Typography color="text.secondary" variant="subtitle1">
            Showing only paid orders (payment completed)
          </Typography>
        </Grid>
        <Grid item>
          <Chip
            label={`${filteredOrders.length} Paid Orders`}
            color="success"
            sx={{ fontSize: '1rem', px: 2, py: 1, fontWeight: 700 }}
          />
        </Grid>
      </Grid>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          sx={{ mb: 3 }}
        />
      )}

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Orders</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Search Orders"
                fullWidth
                placeholder="Search by order ID, buyer name, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Visibility sx={{ fontSize: 64, color: iosColors.primary, opacity: 0.2 }} />
            <Typography variant="h5" color="text.secondary" mt={3}>
              No orders found
            </Typography>
            <Typography color="text.secondary">
              {statusFilter === 'all'
                ? "You haven't received any paid orders yet. Orders will appear here once customers complete payment."
                : `No paid orders with status "${statusFilter}" found.`}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ background: iosColors.card }}>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Buyer</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Order Status</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          #{order.order_number || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>{order.buyer_name || 'Unknown Buyer'}</Typography>
                        <Typography variant="caption" color="text.secondary">{order.buyer_email || ''}</Typography>
                      </TableCell>
                      <TableCell>
                        {(order.items || []).map((item, idx) => (
                          <Typography key={idx} variant="body2">
                            {item.product_name || 'Unknown Product'} x{item.quantity || 0}
                          </Typography>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>
                          ₹{(calculateOrderTotal(order.items) || 0).toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={(order.status || 'pending').replace('_', ' ').toUpperCase()}
                          sx={{
                            background: getStatusColor(order.status || 'pending'),
                            color: '#fff',
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={(order.payment_status || 'pending').replace('_', ' ').toUpperCase()}
                          sx={{
                            background: getPaymentStatusColor(order.payment_status || 'pending'),
                            color: '#fff',
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">{formatDate(order.created_at)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                            setShowShippingForm(false);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3, background: iosColors.card }
          }}
        >
          <DialogTitle sx={{ background: iosColors.primary, color: '#fff', fontWeight: 700 }}>
            Order Details - #{selectedOrder?.order_number || 'N/A'}
            <Button
              onClick={() => setShowModal(false)}
              sx={{ position: 'absolute', right: 16, top: 16, color: '#fff' }}
            >
              <Close />
            </Button>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={700}>Buyer Information</Typography>
                <Typography><strong>Name:</strong> {selectedOrder?.buyer_name || 'N/A'}</Typography>
                <Typography><strong>Email:</strong> {selectedOrder?.buyer_email || 'N/A'}</Typography>
                <Typography><strong>Phone:</strong> {selectedOrder?.buyer_phone || selectedOrder?.phone_number || 'N/A'}</Typography>
                <Typography><strong>Order Date:</strong> {formatDate(selectedOrder?.created_at)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={700}>Order Status</Typography>
                <Chip
                  label={(selectedOrder?.status || 'pending').replace('_', ' ').toUpperCase()}
                  sx={{
                    background: getStatusColor(selectedOrder?.status || 'pending'),
                    color: '#fff',
                    fontWeight: 700,
                    mb: 2
                  }}
                />
                <Typography variant="subtitle1" fontWeight={700}>Delivery Address</Typography>
                {selectedOrder?.delivery_address && (
                  <Box>
                    <Typography>{selectedOrder.delivery_address.full_name || 'N/A'}</Typography>
                    <Typography>{selectedOrder.delivery_address.address_line_1 || 'N/A'}</Typography>
                    {selectedOrder.delivery_address.address_line_2 && (
                      <Typography>{selectedOrder.delivery_address.address_line_2}</Typography>
                    )}
                    <Typography>
                      {selectedOrder.delivery_address.city || 'N/A'}, {selectedOrder.delivery_address.state || 'N/A'}
                    </Typography>
                    <Typography>{selectedOrder.delivery_address.pincode || selectedOrder.delivery_address.postal_code || 'N/A'}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Box my={3}>
              <Typography variant="subtitle1" fontWeight={700}>Order Items</Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 2, mt: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedOrder?.items || []).map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.product_name || 'Unknown Product'}</TableCell>
                        <TableCell>{item.quantity || 0}</TableCell>
                        <TableCell>₹{(item.unit_price || item.price || 0).toLocaleString('en-IN')}</TableCell>
                        <TableCell>₹{(item.total_price || (item.unit_price || item.price || 0) * (item.quantity || 0)).toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3}><strong>Total Amount:</strong></TableCell>
                      <TableCell>
                        <strong>
                          ₹{(calculateOrderTotal(selectedOrder?.items) || 0).toLocaleString('en-IN')}
                        </strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
            </Box>

            {/* Shipping Form */}
            {showShippingForm && (
              <Box my={2} sx={{ background: iosColors.background, borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>
                  <LocalShipping sx={{ mr: 1 }} />
                  Shipping Information Required
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Tracking ID"
                      fullWidth
                      required
                      value={shippingData.tracking_id}
                      onChange={(e) => setShippingData({
                        ...shippingData,
                        tracking_id: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Courier Name</InputLabel>
                      <Select
                        label="Courier Name"
                        value={shippingData.courier_name}
                        onChange={(e) => setShippingData({
                          ...shippingData,
                          courier_name: e.target.value
                        })}
                      >
                        <MenuItem value="">Select courier service</MenuItem>
                        <MenuItem value="Blue Dart">Blue Dart</MenuItem>
                        <MenuItem value="DTDC">DTDC</MenuItem>
                        <MenuItem value="FedEx">FedEx</MenuItem>
                        <MenuItem value="UPS">UPS</MenuItem>
                        <MenuItem value="Delhivery">Delhivery</MenuItem>
                        <MenuItem value="Ecom Express">Ecom Express</MenuItem>
                        <MenuItem value="Xpressbees">Xpressbees</MenuItem>
                        <MenuItem value="India Post">India Post</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                    {shippingData.courier_name === 'Other' && (
                      <TextField
                        label="Enter courier name"
                        fullWidth
                        sx={{ mt: 2 }}
                        onChange={(e) => setShippingData({
                          ...shippingData,
                          courier_name: e.target.value
                        })}
                      />
                    )}
                  </Grid>
                </Grid>
                <Box mt={2} p={2} sx={{ background: '#fff', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    <InfoIcon sx={{ fontSize: 16, mr: 1, color: iosColors.info }} />
                    Customer will receive an email with tracking details and estimated delivery time (7-10 business days).
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={handleShippingSubmit}
                    disabled={!shippingData.tracking_id.trim() || !shippingData.courier_name.trim()}
                  >
                    Mark as Shipped
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Cancel />}
                    onClick={() => {
                      setShowShippingForm(false);
                      setShippingData({ tracking_id: '', courier_name: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            )}

            {/* Status Update Buttons */}
            {!showShippingForm && (
              <Stack direction="row" spacing={2} mt={3}>
                {getAvailableStatusTransitions(selectedOrder?.status || 'pending').map((status) => (
                  <Button
                    key={status}
                    variant={status === 'shipped' ? 'contained' : 'outlined'}
                    color={
                      status === 'shipped'
                        ? 'success'
                        : status === 'cancelled'
                        ? 'error'
                        : 'primary'
                    }
                    startIcon={
                      status === 'shipped' ? <LocalShipping /> :
                      status === 'delivered' ? <CheckCircle /> :
                      status === 'cancelled' ? <Cancel /> : null
                    }
                    onClick={() => handleStatusClick(status)}
                    disabled={status === selectedOrder?.status || !selectedOrder?.id}
                  >
                    {status.replace('_', ' ').toUpperCase()}
                  </Button>
                ))}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)} color="secondary" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default OrdersManagement;
