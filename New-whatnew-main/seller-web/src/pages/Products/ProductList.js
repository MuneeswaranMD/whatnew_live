import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert as MuiAlert,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AnimationIcon from '@mui/icons-material/AutoAwesomeMotion'; // Example animation icon
import Lottie from 'lottie-react';
import emptyBoxAnimation from '../../assets/animations/empty-box.json'; // Place a Lottie JSON animation in this path


import { productService } from '../../services/products';
import { formatCurrency, formatDate, debounce } from '../../utils/helpers';
import { ImageUtils } from '../../utils/imageUtils';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'sold_out', label: 'Sold Out' }
];

const statusColor = {
  active: 'success',
  inactive: 'default',
  sold_out: 'error'
};

const ProductList = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getMyProducts(),
        productService.getCategories()
      ]);
      setProducts(productsData.results || productsData);
      setCategories(categoriesData.results || categoriesData);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load products. Please refresh the page.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      const data = await productService.getMyProducts(params);
      setProducts(data.results || data);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to filter products.'
      });
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const debounced = debounce(() => loadProducts(), 500);
    debounced();
    return () => { /* optional cleanup for custom debounce */ };
  }, [loadProducts]);

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await productService.deleteProduct(productId);
        setProducts(products => products.filter(p => p.id !== productId));
        setAlert({
          type: 'success',
          message: 'Product deleted successfully!'
        });
      } catch {
        setAlert({
          type: 'error',
          message: 'Failed to delete product. Please try again.'
        });
      }
    }
  };

  const handleToggleStatus = async (productId, currentIsActive) => {
    const newStatus = currentIsActive ? 'inactive' : 'active';
    try {
      await productService.updateProductPartial(productId, { status: newStatus });
      setProducts(products =>
        products.map(p =>
          p.id === productId ? { ...p, status: newStatus } : p
        )
      );
      setAlert({
        type: 'success',
        message: `Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`
      });
    } catch {
      setAlert({
        type: 'error',
        message: 'Failed to update product status. Please try again.'
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Related Image and Animated Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
          gap: 3,
          flexWrap: 'wrap'
        }}
      >
       
        <style>
          {`
            @keyframes bounce {
              0% { transform: translateY(0);}
              100% { transform: translateY(-12px);}
            }
            @keyframes spin {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
          `}
        </style>
      </Box>

      <Box sx={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2
      }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom color='black'>My Products</Typography>
          <Typography color="text.secondary">Manage your product inventory</Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/products/create"
          size="large"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Add Product
        </Button>
      </Box>

      {alert && (
        <MuiAlert
          severity={alert.type}
          onClose={() => setAlert(null)}
          sx={{ mb: 3 }}
        >{alert.message}</MuiAlert>
      )}

      {/* Filters */}
      <Card sx={{ p: { xs: 2, md: 3 }, mb: 4, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search Products"
              placeholder="Search by name or description..."
              fullWidth
              size="small"
              variant="outlined"
              value={filters.search}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem value={cat.id} key={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              >
                {statusOptions.map(opt => (
                  <MenuItem value={opt.value} key={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Product Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : products.length > 0 ? (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: '0 8px 32px rgba(59,130,246,0.10)',
                  borderRadius: 0, // Remove border radius
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255,255,255,0.85)', // Glass effect
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.22s, box-shadow 0.27s, background 0.3s',
                  '&:hover': {
                    transform: 'translateY(-7px) scale(1.03)',
                    boxShadow: '0 16px 48px rgba(59,130,246,0.18)',
                    background: 'rgba(245,245,255,0.98)',
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={ImageUtils.getProductImageUrl(product)}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                      borderRadius: 0, // Remove border radius
                      boxShadow: '0 2px 12px rgba(59,130,246,0.10)',
                      filter: 'brightness(0.98) saturate(1.1)',
                    }}
                    onError={e => e.target.src = ImageUtils.getPlaceholderImage()}
                  />
                  <Chip
                    color={statusColor[product.status] || 'default'}
                    label={product.status === 'active' ? 'Active' : product.status === 'inactive' ? 'Inactive' : 'Sold Out'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12, right: 12,
                      fontWeight: 700,
                      borderRadius: 1.5,
                      boxShadow: '0 2px 8px rgba(59,130,246,0.10)'
                    }}
                  />
                </Box>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', pb: 1.5 }}>
                  <Typography gutterBottom fontWeight={700} variant="h6" component="div" noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {(product.description || '').substring(0, 70)}
                    {product.description && product.description.length > 70 && '...'}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="subtitle1" color="primary" fontWeight={800}>
                      {formatCurrency(product.base_price)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {product.available_quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {product.category_name || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {formatDate(product.created_at)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to={`/products/${product.id}/edit`}
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color={product.status === 'active' ? 'warning' : 'success'}
                    startIcon={product.status === 'active' ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
                    onClick={() => handleToggleStatus(product.id, product.status === 'active')}
                  >
                    {product.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(product.id, product.name)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ textAlign: 'center', py: 8, boxShadow: 2, bgcolor: 'background.default', mt: 4 }}>
          <CardContent>
            {/* Lottie Animation for empty state */}
            <Box sx={{ width: 180, mx: 'auto', mb: 2 }}>
              <Lottie animationData={emptyBoxAnimation} loop={true} />
            </Box>
            <AddCircleOutlineIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography gutterBottom variant="h5" component="div">No Products Found</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {filters.search || filters.category || filters.status
                ? 'No products match your current filters. Try adjusting your search criteria.'
                : 'You haven\'t added any products yet. Start by creating your first product!'
              }
            </Typography>
            {!filters.search && !filters.category && !filters.status && (
              <Button
                component={RouterLink}
                to="/products/create"
                variant="contained"
                size="large"
                startIcon={<AddCircleOutlineIcon />}
                sx={{ fontWeight: 700, borderRadius: 2 }}
              >
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProductList;
