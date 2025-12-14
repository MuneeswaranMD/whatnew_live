import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Info as InfoIcon,
  Inventory2 as BoxIcon,
  Gavel as HammerIcon,
  Chat as ChatIcon,
  BarChart as GraphUpIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import ImageUtils from '../../utils/imageUtils';
import AnalyticsCards from './LivestreamAnalytics'; // Adjust the import based on your file structure

function a11yProps(index) {
  return {
    id: `livestream-tab-${index}`,
    'aria-controls': `livestream-tabpanel-${index}`,
  };
}

const TabPanel = (props) => {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`livestream-tabpanel-${index}`} aria-labelledby={`livestream-tab-${index}`}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const LivestreamTabs = ({
  activeTab,
  setActiveTab,
  livestream,
  products,
  biddings,
  chatMessages,
  formatCurrency,
  formatDateTime
}) => {
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Card elevation={4} sx={{
      background: 'linear-gradient(120deg, #f7f7fa 80%, #ececec 100%)',
      boxShadow: '0 8px 32px rgba(255,0,0,0.08)',
      border: '1px solid #ececec'
    }}>
      <CardHeader
        sx={{
          bgcolor: '#e63946',
          p: 0,
        }}
        title={
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="livestream tabs"
            variant="scrollable"
            scrollButtons="auto"
            textColor="inherit"
            TabIndicatorProps={{ style: { backgroundColor: '#b71c1c' } }}
            sx={{
              minHeight: 0,
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #e63946 60%, #b71c1c 100%)'
              },
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 120,
                gap: 1,
                p: 1.2,
                fontSize: '1.08rem',
                letterSpacing: '0.01em',
                transition: 'background 0.25s, color 0.25s, box-shadow 0.2s',
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, #e63946 70%, #b71c1c 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(230,57,70,0.10)',
                  fontWeight: 700,
                  borderBottom: 'none',
                },
                '&:hover:not(.Mui-selected)': {
                  background: '#f2f6fa',
                  color: '#e63946',
                  boxShadow: '0 2px 8px rgba(230,57,70,0.04)',
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: '0 0 0 2px #e6394633',
                },
              },
            }}
          >
            <Tab icon={<InfoIcon />} iconPosition="start" label="Overview" {...a11yProps(0)} />
            <Tab icon={<BoxIcon />} iconPosition="start" label={`Products (${products.length})`} {...a11yProps(1)} />
            <Tab icon={<HammerIcon />} iconPosition="start" label={`Biddings (${biddings.length})`} {...a11yProps(2)} />
            <Tab icon={<ChatIcon />} iconPosition="start" label={`Chat (${chatMessages.length})`} {...a11yProps(3)} />
            <Tab icon={<GraphUpIcon />} iconPosition="start" label="Analytics" {...a11yProps(4)} />
          </Tabs>
        }
      />
      <CardContent sx={{ background: 'linear-gradient(120deg, #fff 80%, #f7f7fa 100%)' }}>
        {/* Overview */}
        <TabPanel value={activeTab} index={0}>
          <Card
            elevation={0}
            sx={{
              background: 'linear-gradient(120deg, #fff 80%, #f7f7fa 100%)',
              boxShadow: '0 4px 16px rgba(230,57,70,0.06)',
              border: '1px solid #ececec',
              mb: 2,
            }}
          >
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" color="#e63946" fontWeight={700} gutterBottom>
                    <InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Technical Information
                  </Typography>
                  <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.05rem' }}>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 600, width: 140, color: '#222' }}>Livestream ID:</td>
                        <td style={{ fontFamily: 'monospace', color: '#b71c1c' }}>{livestream.id}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600, color: '#222' }}>Agora Channel:</td>
                        <td style={{ fontFamily: 'monospace', color: '#555' }}>{livestream.agora_channel_name || 'Not set'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600, color: '#222' }}>Created:</td>
                        <td style={{ color: '#555' }}>{formatDateTime(livestream.created_at)}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600, color: '#222' }}>Last Updated:</td>
                        <td style={{ color: '#555' }}>{formatDateTime(livestream.updated_at)}</td>
                      </tr>
                    </tbody>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" color="#e63946" fontWeight={700} gutterBottom>
                    <GraphUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Performance Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} textAlign="center">
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>Success Rate</Typography>
                      <Typography variant="h4" color="#e63946" fontWeight={700} mt={1}>
                        {biddings.length
                          ? `${Math.round((biddings.filter(b => b.winner_name).length / biddings.length) * 100)}%`
                          : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="center">
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>Revenue Generated</Typography>
                      <Typography variant="h4" color="#b71c1c" fontWeight={700} mt={1}>
                        {formatCurrency(
                          biddings
                            .filter(b => b.winner_name && b.current_highest_bid)
                            .reduce((sum, b) => sum + parseFloat(b.current_highest_bid || 0), 0)
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Products */}
        <TabPanel value={activeTab} index={1}>
          {products.length > 0 ? (
            <Grid container spacing={3}>
              {products.map(product => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card sx={{
                    boxShadow: 3,
                    height: '100%',
                    background: 'linear-gradient(120deg, #fff 80%, #f7f7fa 100%)',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    '&:hover': {
                      boxShadow: '0 10px 32px rgba(230,57,70,0.12)',
                      transform: 'translateY(-2px)',
                    }
                  }}>
                    <Box
                      component="img"
                      src={ImageUtils.getProductImageUrl(product)}
                      alt={product.name}
                      sx={{ height: 200, width: '100%', objectFit: 'cover' /*, borderRadius: '16px 16px 0 0'*/ }}
                      onError={e => (e.currentTarget.src = ImageUtils.getPlaceholderImage())}
                    />
                    <CardContent>
                      <Typography variant="h6" noWrap>{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {product.description || 'No description available'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography fontWeight="bold" color="primary" variant="h6">
                          ₹{(product.base_price || product.price || 0).toLocaleString('en-IN')}
                        </Typography>
                        <Chip
                          label={`${product.stock_quantity || product.available_quantity || 0} in stock`}
                          color={(product.stock_quantity || product.available_quantity) > 10 ? 'success' : (product.stock_quantity || product.available_quantity) > 0 ? 'warning' : 'error'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">{product.category_name || 'Uncategorized'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={6}>
              <Typography color="text.secondary">No products featured</Typography>
            </Box>
          )}
        </TabPanel>

        {/* Biddings */}
        <TabPanel value={activeTab} index={2}>
          {biddings.length > 0 ? (
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Starting Price</TableCell>
                    <TableCell>Final Price</TableCell>
                    <TableCell>Winner</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {biddings.map(bidding => (
                    <TableRow key={bidding.id}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            src={bidding.product?.primary_image || ''}
                            variant="rounded"
                            alt={bidding.product?.name}
                          />
                          <Box>
                            <Typography fontWeight="bold">{bidding.product?.name || 'Unknown Product'}</Typography>
                            <Typography variant="caption" color="text.secondary">{bidding.product?.category_name}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{formatCurrency(bidding.starting_price || 0)}</TableCell>
                      <TableCell>{bidding.current_highest_bid ? formatCurrency(bidding.current_highest_bid) : 'No bids'}</TableCell>
                      <TableCell>
                        {bidding.winner_name
                          ? <Chip label="Sold" color="success" size="small" icon={<TrophyIcon fontSize="small" />} />
                          : <Typography color="text.secondary">No winner</Typography>}
                      </TableCell>
                      <TableCell>
                        <Chip label={bidding.status} size="small" color={bidding.status === 'ended' ? 'default' : bidding.status === 'active' ? 'success' : 'warning'} />
                      </TableCell>
                      <TableCell>{bidding.started_at && formatDateTime(bidding.started_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box textAlign="center" py={6}>
              <Typography color="text.secondary">No biddings were held</Typography>
            </Box>
          )}
        </TabPanel>

        {/* Chat */}
        <TabPanel value={activeTab} index={3}>
          {chatMessages.length > 0 ? (
            <Box sx={{ maxHeight: 400, overflowY: 'auto', p: 1 }}>
              {chatMessages.map((msg, idx) => (
                <Box key={msg.id || idx} display="flex" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}><ChatIcon fontSize="small" /></Avatar>
                  <Box ml={2} flexGrow={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography fontWeight="600">{msg.sender_name || 'User'}</Typography>
                      <Typography variant="caption" color="text.secondary">{formatDateTime(msg.timestamp)}</Typography>
                    </Stack>
                    <Typography color="text.secondary">{msg.content || msg.message}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box textAlign="center" py={6}>
              <Typography color="text.secondary">No chat messages available</Typography>
            </Box>
          )}
        </TabPanel>

        {/* Analytics */}
        <TabPanel value={activeTab} index={4}>
          <Card className="common-card" sx={{
            mb: 2,
            background: 'linear-gradient(120deg, #fff 80%, #f7f7fa 100%)',
            boxShadow: '0 8px 32px rgba(230,57,70,0.08)',
            border: '1px solid #ececec'
          }}>
            <Typography variant="h6" mb={2}>Livestream Performance Analytics</Typography>
            <AnalyticsCards livestream={livestream} biddings={biddings} formatCurrency={formatCurrency} />
            {/* ...rest of analytics content... */}
          </Card>
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default LivestreamTabs;
