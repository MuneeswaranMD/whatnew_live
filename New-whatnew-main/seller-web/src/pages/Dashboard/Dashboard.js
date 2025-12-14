import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Divider,
  Fade,
  Skeleton,
  Container,
  Alert,
  Grow,
} from '@mui/material';

import LiveTvIcon from '@mui/icons-material/LiveTv';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/History';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CoPresentIcon from '@mui/icons-material/CoPresent';

import { formatCurrency, formatDate } from '../../utils/helpers';
import { ImageUtils } from '../../utils/imageUtils';
import { productService } from '../../services/products';
import { livestreamService } from '../../services/livestream';
import { orderService } from '../../services/orders';
import { paymentService } from '../../services/payments';
import { authService } from '../../services/auth';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const StatusChip = ({ status }) => {
  const statusMap = {
    active: { label: 'Active', color: 'success' },
    inactive: { label: 'Inactive', color: 'default' },
    sold_out: { label: 'Sold Out', color: 'error' },
  };
  const { label, color } = statusMap[status] || { label: status, color: 'default' };
  return (
    <Chip
      label={label}
      color={color}
      size="small"
      sx={{ fontSize: '0.75rem', fontWeight: 600, borderRadius: 2, alignSelf: 'flex-start' }}
    />
  );
};

// StatCard: overlay icon and image
const StatCard = ({ title, value, subtitle, icon, image, color, to }) => (
  <Grid item xs={12} sm={6} md={3} onClick={() => to && window.location.assign(to)} sx={{ cursor: to ? 'pointer' : 'default' }}>
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s, boxShadow 0.2s',
        '&:hover': {
          transform: to ? 'translateY(-4px)' : 'none',
          boxShadow: to ? 6 : 3,
          bgcolor: to ? `${color}.lighter` : 'background.paper',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative' }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            bgcolor: `${color}.main`,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            mr: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {icon}
          {image && (
            <Box
              component="img"
              src={image}
              alt={title}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 48,
                height: 48,
                opacity: 0.18,
                objectFit: 'cover',
                borderRadius: 2,
                zIndex: 0,
              }}
            />
          )}
        </Box>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom color='text.primary'>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
      {to && (
        <Button
          component={RouterLink}
          to={to}
          size="small"
          sx={{ mt: 'auto', alignSelf: 'flex-start', fontWeight: 600, textTransform: 'none' }}
          endIcon={<ArrowForwardIosIcon fontSize="small" />}
        >
          View Details
        </Button>
      )}
    </Box>
  </Grid>
);

// QuickActionCard: overlay icon and image
const QuickActionCard = ({ to, icon, image, title, subtitle, gradientColors }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Button
      component={RouterLink}
      to={to}
      variant="outlined"
      sx={{
        flexDirection: 'column',
        p: 3,
        borderRadius: 3,
        height: '100%',
        bgcolor: 'background.paper',
        color: 'text.primary',
        gap: 1,
        borderWidth: 2,
        borderColor: gradientColors[0],
        textTransform: 'none',
        '&:hover': {
          bgcolor: gradientColors[0],
          color: 'white',
          borderColor: gradientColors[1],
          boxShadow: 6,
        },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          mb: 1,
          fontSize: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {icon}
        {image && (
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 56,
              height: 56,
              opacity: 0.18,
              objectFit: 'cover',
              borderRadius: 3,
              zIndex: 0,
            }}
          />
        )}
      </Box>
      <Typography variant="subtitle1" fontWeight={700} color='text.primary'>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary" textAlign="center">
        {subtitle}
      </Typography>
    </Button>
  </Grid>
);

const Dashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProducts: 0,
      totalLivestreams: 0,
      pendingOrders: 0,
      totalEarnings: 0,
    },
    recentProducts: [],
    recentLivestreams: [],
    recentOrders: [],
    credits: 0,
    verificationStatus: 'pending_verification',
  });

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        productsData,
        livestreamsData,
        ordersData,
        earningsData,
        verificationData,
      ] = await Promise.all([
        productService.getMyProducts().catch(() => ({ results: [] })),
        livestreamService.getMyLivestreams().catch(() => ({ results: [] })),
        orderService.getSellerOrders({ limit: 5 }).catch(() => ({ results: [] })),
        paymentService.getSellerEarnings().catch(() => ({ total_earnings: 0 })),
        authService.getVerificationStatus().catch(() => ({ verification_status: 'pending_verification', credits: 0 })),
      ]);

      setDashboardData({
        stats: {
          totalProducts: productsData.results?.length || 0,
          totalLivestreams: livestreamsData.results?.length || 0,
          pendingOrders: ordersData.results?.filter(order => order.status === 'pending').length || 0,
          totalEarnings: earningsData.total_earnings || 0,
        },
        recentProducts: productsData.results?.slice(0, 5) || [],
        recentLivestreams: livestreamsData.results?.slice(0, 5) || [],
        recentOrders: ordersData.results || [],
        credits: verificationData.credits || user?.profile?.credits || 0,
        verificationStatus: verificationData.verification_status || user?.profile?.verification_status || 'pending_verification',
      });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load dashboard data. Please refresh the page.' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const { stats, recentProducts, recentLivestreams, recentOrders, credits, verificationStatus } = dashboardData;

  const verificationInfo = {
    verified: { label: 'Verified Seller', color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
    pending_verification: { label: 'Pending Verification', color: 'warning', icon: <PendingIcon fontSize="small" /> },
    rejected: { label: 'Verification Required', color: 'error', icon: <WarningAmberIcon fontSize="small" /> },
  };

  const currentVerification = verificationInfo[verificationStatus] || verificationInfo.rejected;

  return (
    <Fade in={visible} timeout={600}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            mb: { xs: 2, md: 4 },
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80"
              alt="Dashboard Banner"
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                boxShadow: 2,
                objectFit: 'cover',
                display: { xs: 'none', md: 'block' },
              }}
            />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="error.main" gutterBottom>
                Dashboard
              </Typography>
              <Typography color="text.secondary">
                Welcome back, {user?.first_name || user?.username}! Here's what's happening with your store.
              </Typography>
            </Box>
            {/* Add your image here */}
            
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              mt: { xs: 2, md: 0 },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <Chip
              icon={currentVerification.icon}
              label={currentVerification.label}
              color={currentVerification.color}
              variant="outlined"
              sx={{ mb: { xs: 1, sm: 0 } }}
            />
            <Chip
              component={RouterLink}
              to="/credits"
              icon={<MonetizationOnIcon />}
              label={`${credits} Credits`}
              color="#b71c1cd4"
              clickable
              sx={{ mb: { xs: 1, sm: 0 } }}
            />
            <Button
              variant="contained"
              color="error"
              component={RouterLink}
              to="/livestreams/create"
              startIcon={<LiveTvIcon />}
              sx={{
                fontWeight: 'bold',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Start Livestream
            </Button>
          </Box>
        </Box>

        {alert && (
          <Alert severity="error" onClose={() => setAlert(null)} sx={{ mb: 4 }}>
            {alert.message}
          </Alert>
        )}

        {verificationStatus !== 'verified' && (
          <Alert
            severity="warning"
            sx={{ mb: 4 }}
            action={
              <Button color="inherit" size="small" component={RouterLink} to="/profile">
                View Details
              </Button>
            }
          >
            Your seller account is pending verification. You’ll receive 1 free credit once verified.
            {verificationStatus === 'rejected' && ' Please contact support for assistance.'}
          </Alert>
        )}

        {/* Stats Cards */}
       <Grid
  container
  spacing={3}
  sx={{ mb: 4, maxWidth: 1200, mx: 'auto' }} // Add maxWidth and margin for true page centering
  justifyContent="center"
  alignItems="stretch"
  style={{ cursor: 'default' }}
>
  <StatCard
    title="Total Products"
    value={stats.totalProducts}
    subtitle="Active products in store"
    icon={<Inventory2Icon />}
    image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=48&q=80"
    color="error" // changed from "primary" to "error"
/>
  <StatCard
    title="Livestreams"
    value={stats.totalLivestreams}
    subtitle="Total streams created"
    icon={<LiveTvIcon />}
    image="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=48&q=80"
    color="success"
    to="/livestreams"
  />
  <StatCard
    title="Pending Orders"
    value={stats.pendingOrders}
    subtitle="Require attention"
    icon={<ShoppingCartCheckoutIcon />}
    image="https://images.unsplash.com/photo-1515165562835-cf7747d3f17f?auto=format&fit=crop&w=48&q=80"
    color="warning"
    to="/orders"
  />
  <StatCard
    title="Total Earnings"
    value={formatCurrency(stats.totalEarnings)}
    subtitle="Lifetime revenue"
    icon={<MonetizationOnIcon />}
    image="https://images.unsplash.com/photo-1465101178521-c1a2b3a8e8a5?auto=format&fit=crop&w=48&q=80"
    color="info"
    to="/payments"
  />
</Grid>


        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Quick Actions
          </Typography>
          <Grid  container
  spacing={3}
  sx={{ mb: 4, maxWidth: 1200, mx: 'auto' }} // Add maxWidth and margin for true page centering
  justifyContent="center"
  alignItems="stretch"
  style={{ cursor: 'default' }}>
            <QuickActionCard
              to="/products/create"
              icon={<AddCircleOutlineIcon fontSize="large" />}
              image="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=56&q=80"
              title="Add Product"
              subtitle="Create new product listing"
              gradientColors={['#d32f2f', '#b71c1c']} // changed to red gradient
            />
            <QuickActionCard
              to="/livestreams/create"
              icon={<LiveTvIcon fontSize="large" />}
              image="https://images.unsplash.com/photo-1465101178521-c1a2b3a8e8a5?auto=format&fit=crop&w=56&q=80"
              title="Go Live"
              subtitle="Start broadcasting now"
              gradientColors={['#d32f2f', '#b71c1c']} // changed to red gradient
            />
            <QuickActionCard
              to="/orders"
              icon={<VisibilityIcon fontSize="large" />}
              image="https://images.unsplash.com/photo-1515165562835-cf7747d3f17f?auto=format&fit=crop&w=56&q=80"
              title="View Orders"
              subtitle="Manage customer orders"
              gradientColors={['#2e7d32', '#1b5e20']}
            />
            <QuickActionCard
              to="/credits"
              icon={<MonetizationOnIcon fontSize="large" />}
              image="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=56&q=80"
              title="Buy Credits"
              subtitle="Purchase livestream credits"
              gradientColors={['#f57c00', '#ef6c00']}
            />
          </Grid>
        </Box>

        {/* Recent Products */}
        <Fade in={visible} timeout={600}>
          <Box
            sx={{
              p: { xs: 1, sm: 2, md: 4 },
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(211,47,47,0.10)', // red shadow
              bgcolor: 'background.paper',
              mb: 4,
              maxWidth: 'lg',
              mx: 'auto',
              border: '1px solid',
              borderColor: 'error.light', // red border
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                mb: 3,
                gap: 2,
              }}
            >
              <Typography variant="h5" fontWeight={700} color="error.main">
                Recent Products
              </Typography>
              <Button
                size="small"
                component={RouterLink}
                to="/products"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: 'error.main',
                  borderColor: 'error.main',
                  mt: { xs: 2, sm: 0 },
                  alignSelf: { xs: 'flex-end', sm: 'center' },
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    bgcolor: 'error.light',
                    borderColor: 'error.dark',
                  },
                }}
              >
                View All
              </Button>
            </Box>

            {recentProducts.length > 0 ? (
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {recentProducts.map((product, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Grow in={visible} timeout={400 + idx * 120}>
                      <Box
                        component={RouterLink}
                        to={`/products/${product.id}`}
                        sx={{
                          textDecoration: 'none',
                          p: { xs: 1.5, sm: 2 },
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 3,
                          boxShadow: '0 4px 16px rgba(59,130,246,0.08)',
                          bgcolor: 'background.default',
                          position: 'relative',
                          transition: 'transform 0.35s cubic-bezier(.4,2,.3,1), box-shadow 0.35s, box-shadow 0.5s',
                          '&:hover': {
                            transform: 'scale(1.06) translateY(-4px)',
                            boxShadow: '0 12px 32px rgba(59,130,246,0.18), 0 0 0 4px #60a5fa',
                            bgcolor: 'primary.light',
                            '&::after': {
                              opacity: 1,
                            },
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 3,
                            pointerEvents: 'none',
                            boxShadow: '0 0 16px 2px #60a5fa',
                            opacity: 0,
                            transition: 'opacity 0.4s',
                          },
                        }}
                      >
                        {product.image_url ? (
                          <Box
                            component="img"
                            src={ImageUtils.getProductImageUrl(product)}
                            alt={product.name}
                            sx={{
                              width: '100%',
                              height: { xs: 120, sm: 160 },
                              objectFit: 'cover',
                              borderRadius: 2,
                              mb: 2,
                              boxShadow: '0 2px 8px rgba(59,130,246,0.10)',
                              transition: 'box-shadow 0.3s',
                              '&:hover': {
                                boxShadow: '0 4px 24px rgba(59,130,246,0.18)',
                              },
                            }}
                            onError={(e) => (e.target.src = ImageUtils.getPlaceholderImage())}
                          />
                        ) : (
                          <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2, mb: 2 }} />
                        )}

                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          noWrap
                          gutterBottom
                          color="text.primary"
                          sx={{
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                          sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
                        >
                          {formatCurrency(product.base_price)} • Stock: {product.available_quantity}
                        </Typography>
                        <StatusChip status={product.status} />
                      </Box>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2, mx: 'auto' }} />
                <Typography variant="h6" fontWeight={700} mb={1} color="text.primary">
                  No products yet
                </Typography>
                <Typography color="text.secondary" mb={3}>
                  Start by creating your first product
                </Typography>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/products/create"
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    bgcolor: 'primary.main',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  Add First Product
                </Button>
              </Box>
            )}
          </Box>
        </Fade>

        {/* Sidebar Sections */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 4,
                bgcolor: 'background.paper',
                mb: { xs: 3, md: 4 },
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Orders
                </Typography>
                <Button component={RouterLink} to="/orders" size="small" variant="outlined">
                  View All
                </Button>
              </Box>
              {recentOrders.length > 0 ? (
                recentOrders.slice(0, 5).map(order => (
                  <Box
                    key={order.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      mb: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      pb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Button
                        component={RouterLink}
                        to={`/orders/${order.id}`}
                        sx={{ p: 0, minWidth: 'unset', textTransform: 'none', fontWeight: 'bold' }}
                        size="small"
                      >
                        #{order.order_number}
                      </Button>
                      <Typography color="success.main" fontWeight={600}>
                        {formatCurrency(order.total_amount)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {order.buyer_name || 'N/A'} • {order.items?.length || 0} items
                      </Typography>
                      <Chip
                        label={order.status}
                        size="small"
                        color={
                          order.status === 'completed'
                            ? 'success'
                            : order.status === 'processing'
                            ? 'warning'
                            : order.status === 'pending'
                            ? 'info'
                            : 'default'
                        }
                        sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(order.created_at)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" my={4}>
                  No orders yet
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 4,
                bgcolor: 'background.paper',
                mb: { xs: 3, md: 4 },
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Livestreams
                </Typography>
                <Button component={RouterLink} to="/livestreams" size="small" variant="outlined">
                  View All
                </Button>
              </Box>
              {recentLivestreams.length > 0 ? (
                recentLivestreams.slice(0, 3).map(livestream => (
                  <Box
                    key={livestream.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      mb: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      pb: 2,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" mb={0.5}>
                      {livestream.title}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(livestream.scheduled_start_time)}
                      </Typography>
                      <Chip
                        label={livestream.status}
                        size="small"
                        color={
                          livestream.status === 'live'
                            ? 'error'
                            : livestream.status === 'scheduled'
                            ? 'primary'
                            : livestream.status === 'completed'
                            ? 'success'
                            : 'default'
                        }
                        sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Box>
                ))
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    No livestreams yet
                  </Typography>
                  <Button component={RouterLink} to="/livestreams/create" variant="contained" size="small">
                    Create First Stream
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 4,
                bgcolor: 'error.main', // changed from 'primary.main'
                color: 'white',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Credit Balance
                </Typography>
                <Button
                  component={RouterLink}
                  to="/credits"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'error.dark' }, // red hover
                  }}
                >
                  Manage
                </Button>
              </Box>
              <Typography variant="h3" fontWeight="bold" mb={1}>
                {credits.toLocaleString()}
              </Typography>
              <Typography variant="body2" opacity={0.75}>
                Available Credits
              </Typography>
              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.3)' }} />
              <Grid container textAlign="center">
                <Grid item xs={6}>
                  <Typography fontWeight={600}>₹5</Typography>
                  <Typography variant="body2" opacity={0.75}>
                    Per credit
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight={600}>30min</Typography>
                  <Typography variant="body2" opacity={0.75}>
                    Stream time
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
};

export default Dashboard;
