import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { livestreamService } from '../../services/livestream';
import { productService } from '../../services/products';
import { useForm, validationRules } from '../../hooks/useForm';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { ImageUtils } from '../../utils/imageUtils';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add as AddIcon, Image as ImageIcon, Info as InfoIcon } from '@mui/icons-material';
import './Livestreams.css';

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

const LivestreamForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [thumbnailValidation, setThumbnailValidation] = useState(null);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useForm(
    {
      title: '',
      description: '',
      category: '',
      scheduled_time: '',
      is_scheduled: false
    },
    {
      title: [validationRules.required, validationRules.minLength(5)],
      description: [validationRules.required, validationRules.minLength(10)],
      category: [validationRules.required]
    }
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getMyProducts(),
        productService.getCategories()
      ]);
      const productsArray = Array.isArray(productsResponse) ? productsResponse : (productsResponse?.results || productsResponse?.data || []);
      setProducts(productsArray);
      const categoriesArray = Array.isArray(categoriesResponse) ? categoriesResponse : (categoriesResponse?.results || categoriesResponse?.data || []);
      setCategories(categoriesArray);
    } catch (error) {
      setProducts([]);
      setCategories([]);
      setAlert({
        type: 'danger',
        message: 'Failed to load data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    setThumbnailError(null);
    setThumbnailValidation(null);

    if (file) {
      const validation = await ImageUtils.validateImageDimensions(file);
      setThumbnailValidation(validation);

      if (!validation.isValid) {
        setThumbnailError(validation.message);
        setThumbnailFile(null);
        setThumbnailPreview(null);
        return;
      }

      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setThumbnailError(null);
    setThumbnailValidation(null);
    const fileInput = document.getElementById('thumbnail');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const onSubmit = async (formData) => {
    try {
      if (!thumbnailFile) {
        setAlert({
          type: 'warning',
          message: 'Please upload a thumbnail image with exactly 480×720px dimensions for the livestream.'
        });
        return;
      }

      if (selectedProducts.length === 0) {
        setAlert({
          type: 'warning',
          message: 'Please select at least one product for the livestream.'
        });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);

      selectedProducts.forEach(productId => {
        formDataToSend.append('products', productId);
      });

      if (formData.is_scheduled && formData.scheduled_time) {
        formDataToSend.append('scheduled_start_time', formData.scheduled_time);
      }

      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      const response = await livestreamService.createLivestream(formDataToSend);

      setAlert({
        type: 'success',
        message: 'Livestream created successfully!'
      });

      setTimeout(() => {
        if (response.status === 'live') {
          navigate(`/livestreams/${response.id}/control`);
        } else {
          navigate('/livestreams');
        }
      }, 1500);
    } catch (error) {
      let errorMessage = 'Failed to create livestream. Please try again.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else {
          const fieldErrors = Object.entries(error.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ');
          if (fieldErrors) {
            errorMessage = fieldErrors;
          }
        }
      }
      setAlert({
        type: 'danger',
        message: errorMessage
      });
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  return (
    <Box sx={{ background: iosColors.background, minHeight: '100vh', py: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Card sx={{ boxShadow: 4, background: iosColors.card }}>
            <CardHeader
              title={
                <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                  <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Create New Livestream
                </Typography>
              }
              sx={{ background: iosColors.primary, color: '#fff', py: 2, px: 3 }}
            />
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              {alert && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                  sx={{ mb: 3 }}
                />
              )}

              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit);
                }}
                noValidate
              >
                {/* Basic Information */}
                <Typography variant="h6" sx={{ color: iosColors.primary, mb: 2, fontWeight: 600 }}>
                  Basic Information
                </Typography>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Livestream Title"
                      required
                      fullWidth
                      value={values.title}
                      onChange={e => handleChange('title', e.target.value)}
                      error={!!errors.title}
                      helperText={errors.title}
                      placeholder="Enter an engaging title for your livestream"
                    />
                  </Grid>
                  <Grid item xs={12} md={4} sx={{'minWidth': '100px'}}>
                    <FormControl fullWidth required error={!!errors.category}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        label="Category"
                        value={values.category}
                        onChange={e => handleChange('category', e.target.value)}
                      >
                        <MenuItem value="">Select Category</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.category && (
                        <Typography variant="caption" color="error">{errors.category}</Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      required
                      fullWidth
                      multiline
                      minRows={3}
                      value={values.description}
                      onChange={e => handleChange('description', e.target.value)}
                      error={!!errors.description}
                      helperText={errors.description}
                      placeholder="Describe what viewers can expect from your livestream"
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<ImageIcon />}
                      fullWidth
                      color={thumbnailError ? 'error' : 'primary'}
                    >
                      {thumbnailFile ? 'Change Thumbnail' : 'Upload Thumbnail (480×720px)'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        id="thumbnail"
                        onChange={handleThumbnailChange}
                      />
                    </Button>
                    <Box mt={1}>
                      <Typography variant="caption" color={thumbnailError ? 'error' : 'primary'}>
                        {thumbnailError
                          ? thumbnailError
                          : thumbnailValidation && thumbnailValidation.isValid
                            ? thumbnailValidation.message
                            : 'Required: Exactly 480×720px'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {thumbnailPreview ? (
                      <Box sx={{ position: 'relative', width: 120, height: 180, mx: 'auto' }}>
                        <Avatar
                          variant="rounded"
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          sx={{ width: 120, height: 180, boxShadow: 2 }}
                        />
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          sx={{ position: 'absolute', top: 4, right: 4, minWidth: 0, p: 0.5 }}
                          onClick={removeThumbnail}
                        >
                          Remove
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: 120,
                          height: 180,
                          background: iosColors.background,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#bbb',
                          border: '1px dashed #ccc',
                          mx: 'auto'
                        }}
                      >
                        <ImageIcon sx={{ fontSize: 40 }} />
                      </Box>
                    )}
                  </Grid>
                </Grid>

                {/* Scheduling */}
                <Typography variant="h6" sx={{ color: iosColors.primary, mb: 2, fontWeight: 600 }}>
                  Schedule
                </Typography>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.is_scheduled}
                          onChange={e => setFieldValue('is_scheduled', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Schedule for later (otherwise go live immediately)"
                    />
                  </Grid>
                  {values.is_scheduled && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Scheduled Time"
                        type="datetime-local"
                        fullWidth
                        required
                        value={values.scheduled_time}
                        onChange={e => handleChange('scheduled_time', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: new Date().toISOString().slice(0, 16)
                        }}
                        helperText="Select when you want to start the livestream"
                      />
                    </Grid>
                  )}
                </Grid>

                {/* Product Selection */}
                <Typography variant="h6" sx={{ color: iosColors.primary, mb: 2, fontWeight: 600 }}>
                  Select Products for Bidding
                </Typography>
                <Box mb={2}>
                  {(!products || products.length === 0) ? (
                    <Alert
                      type="warning"
                      message={
                        <>
                          You don't have any products yet.&nbsp;
                          <a href="/products/create" style={{ color: iosColors.primary, textDecoration: 'underline' }}>
                            Create your first product
                          </a>
                        </>
                      }
                    />
                  ) : (
                    <Grid container spacing={2}>
                      {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                          <Card
                            variant={selectedProducts.includes(product.id) ? "outlined" : "elevation"}
                            sx={{
                              borderColor: selectedProducts.includes(product.id) ? iosColors.primary : '#ececec',
                              boxShadow: selectedProducts.includes(product.id) ? `0 0 0 2px ${iosColors.primary}` : 1,
                              cursor: 'pointer',
                              background: iosColors.card,
                              transition: 'box-shadow 0.2s, border-color 0.2s',
                              '&:hover': {
                                boxShadow: `0 4px 16px ${iosColors.primary}22`,
                                borderColor: iosColors.primary,
                              }
                            }}
                            onClick={() => handleProductSelection(product.id)}
                          >
                            <Box
                              component="img"
                              src={ImageUtils.getProductImageUrl(product)}
                              alt={product.name}
                              sx={{ width: '100%', height: 120, objectFit: 'cover' }}
                              onError={e => { e.target.src = ImageUtils.getPlaceholderImage(); }}
                            />
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight={600} noWrap>
                                {product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {product.description || 'No description available'}
                              </Typography>
                              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                                <Chip
                                  label={`₹${parseFloat(product.base_price || product.price || 0).toLocaleString('en-IN')}`}
                                  color="primary"
                                  size="small"
                                />
                                <Chip
                                  label={`${product.stock_quantity || product.available_quantity || 0} in stock`}
                                  color={
                                    (product.stock_quantity || product.available_quantity) > 10
                                      ? 'success'
                                      : (product.stock_quantity || product.available_quantity) > 0
                                        ? 'warning'
                                        : 'error'
                                  }
                                  size="small"
                                />
                              </Stack>
                              <Typography variant="caption" color="text.secondary">
                                {product.category_name || 'Uncategorized'}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                  {selectedProducts.length > 0 && (
                    <Alert
                      type="info"
                      message={`${selectedProducts.length} product(s) selected for this livestream`}
                      sx={{ mt: 2 }}
                    />
                  )}
                </Box>

                {/* Submit Buttons */}
                <Box display="flex" gap={2} justifyContent="flex-end" mt={4}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/livestreams')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || products.length === 0 || !thumbnailFile || thumbnailError}
                    startIcon={<AddIcon />}
                  >
                    {isSubmitting ? 'Creating...' : values.is_scheduled ? 'Schedule Livestream' : 'Create & Go Live'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LivestreamForm;
