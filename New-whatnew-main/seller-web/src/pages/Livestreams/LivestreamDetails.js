import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { livestreamService } from '../../services/livestream';
import { productService } from '../../services/products';
import { chatService } from '../../services/chat';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { ImageUtils } from '../../utils/imageUtils';
import { Box, Typography, Card, CardContent, Grid, Avatar, Stack, Chip } from '@mui/material';
import { Visibility, Gavel, EmojiEvents, AttachMoney } from '@mui/icons-material';
import LivestreamTabs from './LivestreamTabs'; // Adjust path if needed
import './Livestreams.css';

const LivestreamDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [livestream, setLivestream] = useState(null);
  const [products, setProducts] = useState([]);
  const [biddings, setBiddings] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const cardRefs = useRef([]);

  useEffect(() => {
    loadLivestreamDetails();
  }, [id]);

  const loadLivestreamDetails = async () => {
    try {
      setLoading(true);
      
      // Load livestream basic data
      const livestreamData = await livestreamService.getLivestream(id);
      setLivestream(livestreamData);
      
      // Load products for this livestream - use the products array from livestream data
      if (livestreamData.products && Array.isArray(livestreamData.products)) {
        // If products have full data, use them directly
        if (livestreamData.products.length > 0 && livestreamData.products[0].name) {
          setProducts(livestreamData.products);
        } else {
          // If products only have IDs, fetch full product details
          try {
            const productIds = livestreamData.products.map(p => typeof p === 'object' ? p.id : p);
            const productPromises = productIds.map(id => productService.getProduct(id));
            const fullProducts = await Promise.all(productPromises);
            setProducts(fullProducts.filter(p => p)); // Filter out any failed requests
          } catch (detailError) {
            console.warn('Could not load detailed product information:', detailError);
            setProducts(livestreamData.products);
          }
        }
      } else {
        // If products are not included, try to fetch them separately
        try {
          const productsData = await productService.getProductsForLivestream(id);
          setProducts(productsData.products || productsData || []);
        } catch (productError) {
          console.warn('Could not load products for livestream:', productError);
          setProducts([]);
        }
      }
      
      // Load biddings data
      const biddingsResponse = await livestreamService.getBiddings({ livestream: id });
      const biddingsData = biddingsResponse.results || biddingsResponse || [];
      setBiddings(biddingsData);
      
      // Load chat messages (recent ones)
      try {
        const chatData = await chatService.getChatMessages(id, { limit: 50 });
        setChatMessages(chatData.results || chatData || []);
      } catch (chatError) {
        console.warn('Could not load chat messages:', chatError);
      }
      
    } catch (error) {
      console.error('Error loading livestream details:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to load livestream details. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const calculateDuration = () => {
    if (!livestream.actual_start_time || !livestream.end_time) return 0;
    const start = new Date(livestream.actual_start_time);
    const end = new Date(livestream.end_time);
    return Math.round((end - start) / (1000 * 60)); // in minutes
  };

  // iOS-style color palette
  const iosColors = {
    primary: '#ff1a1aff',      // iOS blue
    success: '#34C759',      // iOS green
    warning: '#FF9500',      // iOS orange
    danger: '#FF3B30',       // iOS red
    info: '#5AC8FA',         // iOS light blue
    secondary: '#8E8E93',    // iOS gray
    background: '#F9F9F9',   // iOS background
    card: '#FFFFFF',         // iOS card
    text: '#1C1C1E',         // iOS dark text
  };

  // Update badge color function for iOS style
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'live': return 'ios-bg-danger';
      case 'ended': return 'ios-bg-secondary';
      case 'scheduled': return 'ios-bg-primary';
      case 'cancelled': return 'ios-bg-warning';
      default: return 'ios-bg-secondary';
    }
  };

  const handleEditLivestream = () => {
    navigate(`/livestreams/${id}/edit`);
  };

  const handleViewAnalytics = () => {
    navigate(`/livestreams/${id}/analytics`);
  };

  const handleControlPanel = () => {
    navigate(`/livestreams/${id}/control`);
  };

  // Animation CSS (add to your Livestreams.css or use inline style below)
  const animatedCardStyle = {
    transition: 'transform 0.4s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.3s',
    boxShadow: '0 5px 15px rgba(255,107,53,0.07)',
    borderRadius: '16px',
    background: '#fff',
    border: '1px solid #f3f3f3',
    willChange: 'transform',
  };

  const handleMouseEnter = idx => {
    if (cardRefs.current[idx]) {
      cardRefs.current[idx].style.transform = 'translateY(-8px) scale(1.03)';
      cardRefs.current[idx].style.boxShadow = '0 10px 25px rgba(255,107,53,0.18)';
      cardRefs.current[idx].style.borderColor = '#ff6b35';
    }
  };
  const handleMouseLeave = idx => {
    if (cardRefs.current[idx]) {
      cardRefs.current[idx].style.transform = '';
      cardRefs.current[idx].style.boxShadow = animatedCardStyle.boxShadow;
      cardRefs.current[idx].style.borderColor = '#f3f3f3';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading livestream details..." />;
  }

  if (!livestream) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          Livestream not found.
        </div>
      </div>
    );
  }

  const duration = calculateDuration();

  return (
    <div className="container-fluid py-4" style={{ fontFamily: `'SF Pro Display', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`, background: iosColors.background }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12 col-lg-8">
          <h1 className="h3 mb-1 ios-text" style={{ color: iosColors.primary, fontWeight: 'bold', letterSpacing: '0.5px' }}>
            <i className="bi bi-info-circle me-2"></i>
            Livestream Details
          </h1>
          <p className="ios-muted" style={{ fontSize: '1.1rem' }}>
            Complete information for "<span style={{ color: iosColors.warning, fontWeight: 600 }}>{livestream.title}</span>"
          </p>
        </div>
        <div className="col-12 col-lg-4 d-flex justify-content-lg-end align-items-center gap-2 mt-3 mt-lg-0">
          {livestream.status === 'ended' && (
            <button type="button" className="btn btn-outline-info" style={{ borderColor: iosColors.info, color: iosColors.info }} onClick={handleViewAnalytics}>
              <i className="bi bi-graph-up me-2"></i>
              View Analytics
            </button>
          )}
          {livestream.status === 'live' && (
            <button type="button" className="btn btn-success" style={{ background: iosColors.danger, borderColor: iosColors.danger }} onClick={handleControlPanel}>
              <i className="bi bi-broadcast me-2"></i>
              Control Panel
            </button>
          )}
          {livestream.status !== 'live' && (
            <button type="button" className="btn btn-outline-primary" style={{ borderColor: iosColors.primary, color: iosColors.primary }} onClick={handleEditLivestream}>
              <i className="bi bi-pencil me-2"></i>
              Edit
            </button>
          )}
          <button type="button" className="btn btn-outline-secondary" style={{ borderColor: iosColors.secondary, color: iosColors.secondary }} onClick={() => navigate('/livestreams')}>
            <i className="bi bi-arrow-left me-2"></i>
            Back to List
          </button>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}

      {/* Main Info Card & Stats Side by Side */}
      <div className="row mb-4">
        <div className="col-lg-8 mb-3 mb-lg-0">
          <div
            className="card shadow-sm h-100 ios-card"
            style={{
              ...animatedCardStyle,
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              border: '1px solid #ececec',
            }}
            onMouseEnter={() => handleMouseEnter('main')}
            onMouseLeave={() => handleMouseLeave('main')}
            ref={el => (cardRefs.current['main'] = el)}
          >
            <div className="card-body">
              <div className="row">
                <div className="col-md-5">
                  {livestream.thumbnail ? (
                    <img
                      src={ImageUtils.getFullImageUrl(livestream.thumbnail)}
                      alt={livestream.title}
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '14px' }}
                    />
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '260px' }}>
                      <i className="bi bi-camera ios-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                  )}
                </div>
                <div className="col-md-7">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div>
                      <h2 className="mb-2 ios-text" style={{ color: iosColors.primary }}>{livestream.title}</h2>
                      <span className={`badge ${getStatusBadgeClass(livestream.status)} mb-3`} style={{ fontSize: '0.9rem', borderRadius: '12px', padding: '6px 14px' }}>
                        {livestream.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="ios-muted mb-4">{livestream.description}</p>
                  <div className="row">
                    <div className="col-6 mb-2">
                      <strong className="ios-text">Category:</strong>
                      <div className="ios-muted">{livestream.category_name || 'Not specified'}</div>
                    </div>
                    <div className="col-6 mb-2">
                      <strong className="ios-text">Scheduled Time:</strong>
                      <div className="ios-muted">{formatDateTime(livestream.scheduled_start_time)}</div>
                    </div>
                    <div className="col-6 mb-2">
                      <strong className="ios-text">Actual Start:</strong>
                      <div className="ios-muted">{formatDateTime(livestream.actual_start_time)}</div>
                    </div>
                    <div className="col-6 mb-2">
                      <strong className="ios-text">End Time:</strong>
                      <div className="ios-muted">{formatDateTime(livestream.end_time)}</div>
                    </div>
                    <div className="col-6 mb-2">
                      <strong className="ios-text">Duration:</strong>
                      <div className="ios-muted">{formatDuration(duration)}</div>
                    </div>
                    <div className="col-6 mb-2">
                      <strong className="ios-text">Credits Consumed:</strong>
                      <div style={{ color: iosColors.warning, fontWeight: 'bold' }}>{livestream.credits_consumed || 0} credits</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Statistics Cards stacked vertically on mobile, horizontally on desktop */}
        <div className="col-lg-4">
          <div className="row animated-list">
            {[
              {
                icon: <i className="bi bi-eye mb-2" style={{ fontSize: '2rem', color: iosColors.primary }}></i>,
                value: livestream.viewer_count || 0,
                label: 'Total Viewers',
                color: iosColors.primary,
              },
              {
                icon: <i className="bi bi-box-seam mb-2" style={{ fontSize: '2rem', color: iosColors.success }}></i>,
                value: products.length,
                label: 'Products Featured',
                color: iosColors.success,
              },
              {
                icon: <i className="bi bi-hammer mb-2" style={{ fontSize: '2rem', color: iosColors.warning }}></i>,
                value: biddings.length,
                label: 'Biddings Held',
                color: iosColors.warning,
              },
              {
                icon: <i className="bi bi-chat mb-2" style={{ fontSize: '2rem', color: iosColors.info }}></i>,
                value: chatMessages.length,
                label: 'Chat Messages',
                color: iosColors.info,
              },
            ].map((item, idx) => (
              <div
                className="col-12 mb-3 content"
                key={idx}
                style={{ animationDelay: `${(idx + 1) * 80}ms` }}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                ref={el => (cardRefs.current[idx] = el)}
              >
                <div
                  className="card border-0 text-center ios-card"
                  style={{
                    ...animatedCardStyle,
                    borderRadius: '18px',
                    background: iosColors.card,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.06)',
                    transition: 'all 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
                  }}
                >
                  <div className="card-body">
                    {item.icon}
                    <h4 style={{
                      color: item.color,
                      fontWeight: 700,
                      fontSize: '2rem',
                      marginBottom: '0.5rem',
                      transition: 'color 0.3s',
                    }}>
                      {item.value}
                    </h4>
                    <p className="mb-0 ios-muted" style={{
                      fontWeight: 500,
                      fontSize: '1.05rem',
                      letterSpacing: '0.2px',
                    }}>
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="mb-4">
        <LivestreamTabs
          activeTab={
            // Convert string tab to index for MUI Tabs
            ['overview', 'products', 'biddings', 'chat', 'analytics'].indexOf(activeTab)
          }
          setActiveTab={idx => setActiveTab(['overview', 'products', 'biddings', 'chat', 'analytics'][idx])}
          livestream={livestream}
          products={products}
          biddings={biddings}
          chatMessages={chatMessages}
          formatCurrency={formatCurrency}
          formatDateTime={formatDateTime}
        />
      </div>
    </div>
  );
  
};

const ChatTab = ({ chatMessages, formatDateTime }) => (
  <Box sx={{ maxHeight: 400, overflowY: 'auto', p: 1 }}>
    {chatMessages.length > 0 ? (
      chatMessages.map((message, i) => (
        <Box key={message.id || i} display="flex" mb={2}>
          <Avatar
            sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}
            aria-label="user"
          >
            <i className="bi bi-person-fill"></i>
          </Avatar>
          <Box ml={2} flexGrow={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography fontWeight="600">{message.sender_name || 'User'}</Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDateTime(message.timestamp)}
              </Typography>
            </Stack>
            <Typography color="text.secondary">{message.content || message.message}</Typography>
          </Box>
        </Box>
      ))
    ) : (
      <Box textAlign="center" py={8}>
        <i className="bi bi-chat" style={{ fontSize: 48, color: '#bbb' }}></i>
        <Typography variant="h6" color="text.secondary" mt={2}>No chat messages available</Typography>
      </Box>
    )}
  </Box>
);

const AnalyticsCards = ({ livestream, biddings, formatCurrency }) => {
  const totalRevenue = biddings.filter(b => b.current_highest_bid).reduce((sum, b) => sum + Number(b.current_highest_bid || 0), 0);

  const cardData = [
    {
      icon: <Visibility sx={{ fontSize: 48, color: '#c0392b' }} />,
      value: livestream.viewer_count || 0,
      label: 'Total Viewers',
      color: 'error.main',
    },
    {
      icon: <Gavel sx={{ fontSize: 48, color: '#e67e22' }} />,
      value: biddings.length,
      label: 'Total Biddings',
      color: 'warning.main',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 48, color: '#f1c40f' }} />,
      value: biddings.filter(b => b.winner_name).length,
      label: 'Successful Sales',
      color: 'warning.dark',
    },
    {
      icon: <AttachMoney sx={{ fontSize: 48, color: '#3498db' }} />,
      value: formatCurrency(totalRevenue),
      label: 'Total Revenue',
      color: 'info.main',
    },
  ];

  return (
    <Grid container spacing={3} mt={2}>
      {cardData.map(({ icon, value, label, color }, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: '0 5px 12px rgba(0,0,0,0.08)',
              textAlign: 'center',
              py: 3,
              px: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                transform: 'translateY(-4px)',
              },
            }}
            elevation={5}
          >
            {icon}
            <Typography variant="h4" color={color} fontWeight="700" mt={1} mb={0.5}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {label}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LivestreamDetails;
