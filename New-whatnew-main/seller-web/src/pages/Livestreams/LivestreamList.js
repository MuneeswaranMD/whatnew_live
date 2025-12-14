import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { livestreamService } from '../../services/livestream';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Alert from '../../components/Common/Alert';
import { formatDate, formatDuration, getStatusBadgeClass, debounce } from '../../utils/helpers';
import { ImageUtils } from '../../utils/imageUtils';
import { Box, Button, Card, CardContent, Typography, Grid, Chip, Stack } from '@mui/material';
import { Delete, PlayArrow, Edit, Stop, Visibility, BarChart } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import './Livestreams.css';

// iOS-inspired colors
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

const LivestreamList = () => {
  const theme = useTheme();
  const [livestreams, setLivestreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });

  useEffect(() => {
    loadLivestreams();
  }, []);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      loadLivestreams();
    }, 500);

    debouncedSearch();
  }, [filters]);

  const loadLivestreams = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;

      const data = await livestreamService.getMyLivestreams(params);
      setLivestreams(data.results || data);
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Failed to load livestreams. Please refresh the page.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (livestreamId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await livestreamService.deleteLivestream(livestreamId);
        setLivestreams(livestreams.filter(l => l.id !== livestreamId));
        setAlert({
          type: 'success',
          message: 'Livestream deleted successfully!'
        });
      } catch (error) {
        setAlert({
          type: 'danger',
          message: 'Failed to delete livestream. Please try again.'
        });
      }
    }
  };

  const handleStartLivestream = async (livestreamId) => {
    try {
      await livestreamService.startLivestream(livestreamId);
      loadLivestreams();
      setAlert({
        type: 'success',
        message: 'Livestream started successfully!'
      });
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.error || 'Failed to start livestream. Please try again.'
      });
    }
  };

  const handleEndLivestream = async (livestreamId) => {
    if (window.confirm('Are you sure you want to end this livestream?')) {
      try {
        await livestreamService.endLivestream(livestreamId);
        loadLivestreams();
        setAlert({
          type: 'success',
          message: 'Livestream ended successfully!'
        });
      } catch (error) {
        setAlert({
          type: 'danger',
          message: 'Failed to end livestream. Please try again.'
        });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading livestreams..." />;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: iosColors.background, minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" sx={{ color: iosColors.primary, fontWeight: 900, letterSpacing: 0.5 }}>
            My Livestreams
          </Typography>
          <Typography color="text.secondary" variant="subtitle1">
            Manage your livestream sessions
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/livestreams/create"
          variant="contained"
          startIcon={<PlayArrow />}
          sx={{
            backgroundColor: iosColors.primary,
            '&:hover': { backgroundColor: theme.palette.error.dark },
          }}
        >
          Create Livestream
        </Button>
      </Box>

      {/* Search Option */}
      <Box mb={3} display="flex" alignItems="center" gap={2} flexWrap="wrap">
        <Box sx={{ minWidth: 300 }}>
          <input
            type="text"
            placeholder="Search livestreams..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #ececec',
              borderRadius: 4,
              background: iosColors.card,
              fontSize: '1rem',
              color: '#222'
            }}
          />
        </Box>
        <Box>
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            style={{
              padding: '10px 14px',
              border: '1px solid #ececec',
              borderRadius: 4,
              background: iosColors.card,
              fontSize: '1rem',
              color: '#222'
            }}
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="ended">Ended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Box>
      </Box>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} sx={{ mb: 3 }} />
      )}

      {/* Livestreams Grid */}
      {livestreams.length > 0 ? (
        <Grid container spacing={3}>
          {livestreams.map((livestream) => {
            const duration = livestream.duration || 0;
            const statusColors = {
              scheduled: iosColors.warning,
              live: iosColors.primary,
              ended: '#888',
              cancelled: '#888',
            };
            const statusColor = statusColors[livestream.status] || '#888';

            return (
              <Grid key={livestream.id} item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    backgroundColor: iosColors.card,
                    boxShadow: '0 8px 24px rgba(230, 57, 70, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 32px rgba(230, 57, 70, 0.3)',
                    },
                  }}
                >
                  {livestream.thumbnail ? (
                    <Box
                      component="img"
                      src={ImageUtils.getFullImageUrl(livestream.thumbnail)}
                      alt={livestream.title}
                      sx={{ width: '100%', height: 240, objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 240,
                        backgroundColor: iosColors.background,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Visibility sx={{ fontSize: 64, color: 'rgba(0,0,0,0.1)' }} />
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} flexWrap="wrap" gap={1}>
                      <Typography variant="h6" sx={{ color: iosColors.primary, fontWeight: 700 }}>
                        {livestream.title}
                      </Typography>
                      <Chip
                        label={livestream.status.toUpperCase()}
                        sx={{
                          backgroundColor: statusColor,
                          color: '#fff',
                          fontWeight: 700,
                          px: 1.5,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {livestream.description}
                    </Typography>

                    <Box mt={2}>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Scheduled:</strong> {formatDate(livestream.scheduled_start_time)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Duration:</strong> {formatDuration(duration)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Products:</strong> {livestream.products ? livestream.products.length : 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Viewers:</strong> {livestream.viewer_count || 0}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Action buttons */}
                    <Box mt={3} display="flex" gap={1} flexWrap="wrap">
                      {livestream.status === 'scheduled' && (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: iosColors.success }}
                            onClick={() => handleStartLivestream(livestream.id)}
                          >
                            Start Live
                          </Button>
                          <Button
                            component={Link}
                            to={`/livestreams/${livestream.id}/edit`}
                            variant="outlined"
                            size="small"
                            sx={{ borderColor: iosColors.primary, color: iosColors.primary }}
                          >
                            Edit
                          </Button>
                        </>
                      )}
                      {livestream.status === 'live' && (
                        <>
                          <Button
                            component={Link}
                            to={`/livestreams/${livestream.id}/control`}
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: iosColors.primary }}
                          >
                            Control Panel
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: iosColors.danger }}
                            onClick={() => handleEndLivestream(livestream.id)}
                          >
                            End Live
                          </Button>
                        </>
                      )}
                      {livestream.status === 'ended' && (
                        <>
                          <Button
                            component={Link}
                            to={`/livestreams/${livestream.id}/analytics`}
                            variant="outlined"
                            size="small"
                            sx={{ borderColor: iosColors.info, color: iosColors.info }}
                          >
                            Analytics
                          </Button>
                          <Button
                            component={Link}
                            to={`/livestreams/${livestream.id}/edit`}
                            variant="outlined"
                            size="small"
                            sx={{ borderColor: iosColors.primary, color: iosColors.primary }}
                          >
                            Duplicate
                          </Button>
                        </>
                      )}
                      <Button
                        component={Link}
                        to={`/livestreams/${livestream.id}/details`}
                        variant="outlined"
                        size="small"
                        sx={{ borderColor: iosColors.secondary, color: iosColors.secondary }}
                      >
                        View Details
                      </Button>
                      {livestream.status !== 'live' && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleDelete(livestream.id, livestream.title)}
                        >
                          <Delete fontSize="small" />
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <div className="card shadow-sm" style={{
          background: iosColors.card,
          border: '1px solid #ececec',
          boxShadow: '0 8px 32px rgba(230,57,70,0.06)',
        }}>
          <div className="card-body text-center py-5">
            <i className="bi bi-broadcast text-muted" style={{ fontSize: '4rem' }}></i>
            <h3 className="mt-3 mb-2" style={{ color: iosColors.primary, fontWeight: 700 }}>No Livestreams Found</h3>
            <p className="text-muted mb-4">
              {filters.search || filters.status
                ? 'No livestreams match your current filters. Try adjusting your search criteria.'
                : 'You haven\'t created any livestreams yet. Start by creating your first livestream!'
              }
            </p>
            {!filters.search && !filters.status && (
              <Link to="/livestreams/create" className="btn btn-primary" style={{ background: iosColors.primary, borderColor: iosColors.primary }}>
                <i className="bi bi-plus-circle me-2"></i>
                Create Your First Livestream
              </Link>
            )}
          </div>
        </div>
      )}
    </Box>
  );
};

export default LivestreamList;
