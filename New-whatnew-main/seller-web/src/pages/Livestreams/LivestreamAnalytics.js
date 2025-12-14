import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { livestreamService } from '../../services/livestream';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { ImageUtils } from '../../utils/imageUtils';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  MonetizationOn as MonetizationOnIcon,
  Gavel as GavelIcon,
  Inventory2 as Inventory2Icon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  InfoOutlined as InfoOutlinedIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Hammer as HammerIcon, // May need installation, or replace with another icon
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';

const LivestreamAnalytics = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [livestream, setLivestream] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalViewers: 0,
    peakViewers: 0,
    totalBiddings: 0,
    successfulBiddings: 0,
    totalRevenue: 0,
    creditsConsumed: 0,
    duration: 0,
    chatMessages: 0,
    productsSold: 0,
    averageBidAmount: 0,
    viewerRetention: 0,
    engagementRate: 0,
  });
  const [biddings, setBiddings] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [id]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const livestreamData = await livestreamService.getLivestream(id);
      setLivestream(livestreamData);

      const biddingsResponse = await livestreamService.getBiddings({ livestream: id });
      const biddingsData = biddingsResponse.results || biddingsResponse || [];
      setBiddings(biddingsData);

      const calculatedAnalytics = calculateAnalytics(livestreamData, biddingsData);
      setAnalytics(calculatedAnalytics);

      const timeline = generateTimelineData(livestreamData, biddingsData);
      setTimelineData(timeline);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to load analytics data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (livestreamData, biddingsData) => {
    const totalBiddings = biddingsData.length;
    const successfulBiddings = biddingsData.filter(b => b.status === 'ended' && b.winner).length;
    const totalRevenue = biddingsData
      .filter(b => b.winner && b.current_highest_bid)
      .reduce((sum, b) => sum + parseFloat(b.current_highest_bid || 0), 0);

    const averageBidAmount = successfulBiddings > 0 ? totalRevenue / successfulBiddings : 0;

    let duration = 0;
    if (livestreamData.actual_start_time && livestreamData.end_time) {
      const start = new Date(livestreamData.actual_start_time);
      const end = new Date(livestreamData.end_time);
      duration = Math.round((end - start) / (1000 * 60)); // minutes
    }

    return {
      totalViewers: livestreamData.total_viewers || livestreamData.viewer_count || 0,
      peakViewers: livestreamData.peak_viewers || livestreamData.viewer_count || 0,
      totalBiddings,
      successfulBiddings,
      totalRevenue,
      creditsConsumed: livestreamData.credits_consumed || 0,
      duration,
      chatMessages: livestreamData.total_messages || 0,
      productsSold: successfulBiddings,
      averageBidAmount,
      viewerRetention: 75, // mock data; replace with real calculation
      engagementRate: totalBiddings > 0 ? (successfulBiddings / totalBiddings) * 100 : 0,
    };
  };

  const generateTimelineData = (livestreamData, biddingsData) => {
    const timeline = [];

    if (livestreamData.actual_start_time) {
      timeline.push({
        time: new Date(livestreamData.actual_start_time),
        event: 'Livestream Started',
        type: 'start',
        description: 'Livestream went live',
      });
    }
    biddingsData.forEach(bidding => {
      if (bidding.started_at) {
        timeline.push({
          time: new Date(bidding.started_at),
          event: 'Bidding Started',
          type: 'bidding',
          description: `Bidding started for ${bidding.product?.name || 'product'}`,
        });
      }
      if (bidding.ended_at) {
        timeline.push({
          time: new Date(bidding.ended_at),
          event: 'Bidding Ended',
          type: 'bidding',
          description: `Bidding ended for ${bidding.product?.name || 'product'}${bidding.winner ? ` - Won by ${bidding.winner_name}` : ''}`,
        });
      }
    });
    if (livestreamData.end_time) {
      timeline.push({
        time: new Date(livestreamData.end_time),
        event: 'Livestream Ended',
        type: 'end',
        description: 'Livestream concluded',
      });
    }

    return timeline.sort((a, b) => a.time - b.time);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  if (loading) return <LoadingSpinner text="Loading analytics..." />;

  if (!livestream)
    return (
      <Box p={4}>
        <Alert type="danger" message="Livestream not found." />
      </Box>
    );

  return (
    <Box p={4} maxWidth="1200px" mx="auto">
      {/* Header */}
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
              color: '#c0392b',
              fontWeight: 'bold',
            }}
          >
            <VisibilityIcon color="error" />
            Livestream Analytics
          </Typography>
          <Typography color="text.secondary" fontSize="1rem">
            Performance insights for &quot;{livestream.title}&quot;
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<InfoOutlinedIcon />}
            onClick={() => navigate(`/livestreams/${id}/details`)}
            sx={{
              borderRadius: 2,
              color: '#c0392b',
              borderColor: '#ff6b35',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff6b35, #e55a2b)',
                color: 'white',
                borderColor: '#c0392b',
                boxShadow: '0 5px 15px rgba(255, 107, 53, 0.3)',
              },
            }}
          >
            View Details
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/livestreams')}
            sx={{
              borderRadius: 2,
              color: '#c0392b',
              borderColor: '#ff6b35',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff6b35, #e55a2b)',
                color: 'white',
                borderColor: '#c0392b',
                boxShadow: '0 5px 15px rgba(255, 107, 53, 0.3)',
              },
            }}
          >
            Back to List
          </Button>
        </Stack>
      </Box>

      {/* Livestream Basic Info */}
      <Card
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#ff6b35',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2}>
              {livestream.thumbnail && (
                <Box
                  component="img"
                  src={ImageUtils.getFullImageUrl(livestream.thumbnail)}
                  alt={livestream.title}
                  sx={{ borderRadius: 2, width: '100%', maxHeight: 100, objectFit: 'cover' }}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight="600">
                {livestream.title}
              </Typography>
              <Typography color="text.secondary" mb={1}>
                {livestream.description}
              </Typography>
              <Chip
                label={livestream.status?.toUpperCase()}
                sx={{
                  background: (() => {
                    switch (livestream.status) {
                      case 'live':
                        return 'linear-gradient(135deg, #ff6b35, #e74c3c)';
                      case 'ended':
                        return '#bdbdbd';
                      case 'scheduled':
                        return '#1976d2';
                      case 'cancelled':
                        return '#ffa726';
                      default:
                        return '#bdbdbd';
                    }
                  })(),
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: 1.5,
                  px: 1.5,
                }}
              />
              <Typography variant="caption" color="text.secondary" ml={1}>
                <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                {formatDateTime(livestream.scheduled_start_time || livestream.created_at)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="h6">{formatDuration(analytics.duration)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Credits Used
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {analytics.creditsConsumed}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
  {[ // Array of items to map for brevity
    {
      icon: <VisibilityIcon color="primary" sx={{ fontSize: 48 }} />,
      mainValue: analytics.totalViewers.toLocaleString(),
      mainColor: '#c0392b',
      mainText: 'Total Viewers',
      subText: `Peak: ${analytics.peakViewers}`,
      subColor: 'success.main',
    },
    {
      icon: <MonetizationOnIcon color="success" sx={{ fontSize: 48 }} />,
      mainValue: formatCurrency(analytics.totalRevenue),
      mainText: 'Total Revenue',
      subText: `Avg: ${formatCurrency(analytics.averageBidAmount)}`,
      subColor: 'text.secondary',
    },
    {
      icon: <GavelIcon color="warning" sx={{ fontSize: 48 }} />,
      mainValue: analytics.totalBiddings,
      mainText: 'Total Biddings',
      subText: `${analytics.successfulBiddings} successful`,
      subColor: 'success.main',
    },
    {
      icon: <Inventory2Icon color="info" sx={{ fontSize: 48 }} />,
      mainValue: analytics.productsSold,
      mainText: 'Products Sold',
      subText: `${analytics.engagementRate.toFixed(1)}% conversion`,
      subColor: 'text.secondary',
    },
  ].map((item, idx) => (
    <Grid item xs={12} sm={6} md={3} key={idx}>
      <Card
        elevation={3}
        sx={{
          borderRadius: 2,
          py: 3,
          px: 2,
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#ff6b35',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          height: '100%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {item.icon}
          <Typography variant="h6" fontWeight="bold" sx={{ color: item.mainColor }}>
            {item.mainValue}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          {item.mainText}
        </Typography>
        <Typography variant="caption" color={item.subColor}>
          {item.subText}
        </Typography>
      </Card>
    </Grid>
  ))}
</Grid>


      {/* Performance Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1} color='#c0392b'>
                  <VisibilityIcon />
                  Performance Metrics
                </Typography>
              }
              sx={{ bgcolor: 'background.paper' }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Viewer Retention
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Box flexGrow={1}>
                      <LinearProgress
                        variant="determinate"
                        value={analytics.viewerRetention}
                        color="success"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography color="success.main" fontWeight="bold">
                      {analytics.viewerRetention}%
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Engagement Rate
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Box flexGrow={1}>
                      <LinearProgress
                        variant="determinate"
                        value={analytics.engagementRate}
                        color="primary"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography color="primary.main" fontWeight="bold">
                      {analytics.engagementRate.toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Revenue per Hour
                  </Typography>
                  <Typography variant="subtitle1" color="success.main" fontWeight="bold">
                    {analytics.duration > 0
                      ? formatCurrency((analytics.totalRevenue / analytics.duration) * 60)
                      : formatCurrency(0)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Credits per Hour
                  </Typography>
                  <Typography variant="subtitle1" color="warning.main" fontWeight="bold">
                    {analytics.duration > 0
                      ? ((analytics.creditsConsumed / analytics.duration) * 60).toFixed(1)
                      : '0'}{' '}
                    credits
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Timeline */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1} color='#c0392b'>
                  <InfoIcon />
                  Timeline
                </Typography>
              }
              sx={{ bgcolor: 'background.paper' }}
            />
            <CardContent>
              <Box
                sx={{
                  maxHeight: 300,
                  overflowY: 'auto',
                  pr: 1,
                }}
              >
                {timelineData.map((item, index) => {
                  let icon;
                  let bgColor;

                  if (item.type === 'start') {
                    icon = <PlayArrowIcon fontSize="small" htmlColor="#fff" />;
                    bgColor = 'success.main';
                  } else if (item.type === 'end') {
                    icon = <StopIcon fontSize="small" htmlColor="#fff" />;
                    bgColor = 'grey.500';
                  } else {
                    icon = <GavelIcon fontSize="small" htmlColor="#fff" />;
                    bgColor = 'primary.main';
                  }

                  return (
                    <Box key={index} display="flex" mb={2} alignItems="center" gap={2}>
                      <Box
                        sx={{
                          bgcolor: bgColor,
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {icon}
                      </Box>
                      <Box>
                        <Typography fontWeight="bold" variant="body2">
                          {item.event}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" mb={0.2}>
                          {item.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontStyle="italic">
                          {item.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bidding Details */}
      {biddings.length > 0 && (
        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1} color='#c0392b'>
                <InfoIcon />
                Bidding Results
              </Typography>
            }
            sx={{ bgcolor: 'background.paper' }}
          />
          <CardContent>
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Starting Price</TableCell>
                    <TableCell>Final Price</TableCell>
                    <TableCell>Winner</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {biddings.map((bidding) => {
                    const durationSeconds =
                      bidding.started_at && bidding.ended_at
                        ? Math.round((new Date(bidding.ended_at) - new Date(bidding.started_at)) / 1000)
                        : bidding.timer_duration || 0;
                    return (
                      <TableRow key={bidding.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {bidding.product?.primary_image && (
                              <Avatar
                                src={ImageUtils.getProductImageUrl(bidding.product)}
                                alt={bidding.product.name}
                                variant="rounded"
                                sx={{ width: 40, height: 40 }}
                              />
                            )}
                            <Box>
                              <Typography fontWeight="bold">{bidding.product?.name || 'Unknown Product'}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {bidding.product?.category_name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{formatCurrency(bidding.starting_price || 0)}</TableCell>
                        <TableCell>
                          {bidding.current_highest_bid ? (
                            <Typography color="success.main" fontWeight="bold">
                              {formatCurrency(bidding.current_highest_bid)}
                            </Typography>
                          ) : (
                            <Typography color="text.disabled">No bids</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {bidding.winner_name ? (
                            <Stack direction="row" alignItems="center" spacing={0.5} color="success.main">
                              <TrophyIcon fontSize="small" />
                              <Typography>{bidding.winner_name}</Typography>
                            </Stack>
                          ) : (
                            <Typography color="text.disabled">No winner</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={bidding.status}
                            color={
                              bidding.status === 'ended'
                                ? 'default'
                                : bidding.status === 'active'
                                ? 'success'
                                : 'warning'
                            }
                            size="small"
                            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>{durationSeconds > 0 ? `${durationSeconds}s` : '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default LivestreamAnalytics;
