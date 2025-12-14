import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/products';
import { useForm, validationRules } from '../../hooks/useForm';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { validateImageFile } from '../../utils/helpers';
import { ImageUtils } from '../../utils/imageUtils';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
  } = useForm(
    {
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category: '',
      is_active: true,
    },
    {
      name: [validationRules.required, validationRules.maxLength(100)],
      description: [validationRules.required, validationRules.maxLength(1000)],
      price: [validationRules.required, validationRules.price],
      stock_quantity: [validationRules.required, validationRules.stock],
      category: [validationRules.required],
    }
  );

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData.results || categoriesData);

      if (isEditing) {
        const productData = await productService.getProduct(id);
        setValues({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.base_price || '',
          stock_quantity: productData.quantity || '',
          category: productData.category || '',
          is_active: productData.status === 'active',
        });
        setExistingImages(productData.images || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to load product data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const errors = [];

    for (const file of files) {
      const error = await validateImageFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      setAlert({
        type: 'danger',
        message: 'Image validation errors:\n' + errors.join('\n'),
      });
      return;
    }

    const totalImages = existingImages.length + selectedImages.length + validFiles.length;
    if (totalImages > 5) {
      setAlert({
        type: 'warning',
        message: 'You can only upload up to 5 images per product.',
      });
      return;
    }

    setSelectedImages([...selectedImages, ...validFiles]);
  };

  const removeSelectedImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId) => {
    try {
      await productService.deleteProductImage(imageId);
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      setAlert({
        type: 'success',
        message: 'Image removed successfully!',
      });
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Failed to remove image. Please try again.',
      });
    }
  };

  const uploadImages = async (productId) => {
    if (selectedImages.length === 0) return;

    setUploadingImages(true);
    try {
      for (const image of selectedImages) {
        await productService.uploadProductImage(productId, image);
      }
      setSelectedImages([]);
    } catch (error) {
      console.error('Error uploading images:', error);

      let errorMessage = 'Failed to upload images.';
      if (error.response?.status === 404) {
        errorMessage = 'Image upload endpoint not found. Please check the product ID.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setAlert({
        type: 'warning',
        message: `Product created successfully, but ${errorMessage}`,
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const transformedData = {
        name: formData.name,
        description: formData.description,
        base_price: parseFloat(formData.price),
        quantity: parseInt(formData.stock_quantity),
        category: formData.category,
        status: formData.is_active ? 'active' : 'inactive',
      };

      let productData;

      if (isEditing) {
        productData = await productService.updateProduct(id, transformedData);
        setAlert({ type: 'success', message: 'Product updated successfully!' });
      } else {
        productData = await productService.createProduct(transformedData);
        setAlert({ type: 'success', message: 'Product created successfully!' });
      }

      if (selectedImages.length > 0) {
        try {
          await uploadImages(productData.id);
        } catch (imageError) {
          console.warn('Product saved but image upload failed:', imageError);
        }
      }

      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (error) {
      console.error('Error saving product:', error);

      let errorMessage = 'Failed to save product. Please try again.';

      if (error.response?.data) {
        const errorData = error.response.data;

        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          const fieldErrors = [];
          Object.keys(errorData).forEach((field) => {
            if (Array.isArray(errorData[field])) {
              fieldErrors.push(`${field}: ${errorData[field].join(', ')}`);
            } else {
              fieldErrors.push(`${field}: ${errorData[field]}`);
            }
          });
          if (fieldErrors.length > 0) {
            errorMessage = `Validation errors: ${fieldErrors.join('; ')}`;
          }
        }
      }

      setAlert({ type: 'danger', message: errorMessage });
    }
  };

  if (loading) return <LoadingSpinner text="Loading product data..." />;

  return (
    <Box className="container-fluid py-4">
      <Box className="row justify-content-center">
        <Box className="col-lg-8">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 4,
              gap: 3,
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() => navigate('/products')}
              sx={{ borderRadius: 2 }}
            >
              <i className="bi bi-arrow-left"></i>
            </Button>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                color="error"
                fontWeight="bold"
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80"
                  alt="Product"
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(253, 7, 7, 0.12)',
                    mr: 1,
                  }}
                />
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </Typography>
              <Typography
                variant="body2"
                color="#19191aff"
                sx={{ mb: 1 }}
              >
                {isEditing
                  ? 'Update your product information and keep your store fresh. Make sure to upload clear images and accurate details.'
                  : 'Create a new product for your store. Good images and descriptions help your products sell faster!'}
              </Typography>
              <Alert
                type="info"
                message={
                  <>
                    <i className="bi bi-lightbulb me-1"></i>
                    <strong>Tip:</strong> Products with high-quality images and detailed descriptions attract more buyers.
                  </>
                }
                sx={{ borderRadius: 2, mt: 1 }}
              />
            </Box>
          </Box>

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
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: '#fafafa',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              maxWidth: '100%',
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 60%' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="medium"
                  label="Product Name *"
                  value={values.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      '&.Mui-focused': {
                        borderColor: '#d32f2f',
                        boxShadow: '0 0 8px rgba(211,47,47,0.25)',
                      },
                    },
                    mb: 2,
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 35%' }}>
                <TextField
                  select
                  fullWidth
                  SelectProps={{ native: true }}
                  label="Category *"
                  value={values.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  error={!!errors.category}
                  helperText={errors.category}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      '&.Mui-focused': {
                        borderColor: '#d32f2f',
                        boxShadow: '0 0 8px rgba(211,47,47,0.25)',
                      },
                    },
                    mb: 2,
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Description *"
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={!!errors.description}
              helperText={`${values.description.length}/1000 characters`}
              sx={{
                borderRadius: 2,
                backgroundColor: '#fff',
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  '&.Mui-focused': {
                    borderColor: '#d32f2f',
                    boxShadow: '0 0 8px rgba(211,47,47,0.25)',
                  },
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
              <TextField
                label="Price (₹) *"
                type="number"
                inputProps={{ step: '0.01', min: 0 }}
                value={values.price}
                onChange={(e) => handleChange('price', e.target.value)}
                error={!!errors.price}
                helperText={errors.price}
                sx={{
                  flex: '1 1 45%',
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    '&.Mui-focused': {
                      borderColor: '#d32f2f',
                      boxShadow: '0 0 8px rgba(211,47,47,0.25)',
                    },
                  },
                }}
              />

              <TextField
                label="Stock Quantity *"
                type="number"
                inputProps={{ min: 0 }}
                value={values.stock_quantity}
                onChange={(e) => handleChange('stock_quantity', e.target.value)}
                error={!!errors.stock_quantity}
                helperText={errors.stock_quantity}
                sx={{
                  flex: '1 1 45%',
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    '&.Mui-focused': {
                      borderColor: '#d32f2f',
                      boxShadow: '0 0 8px rgba(211,47,47,0.25)',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <input
                  type="checkbox"
                  id="is_active"
                  checked={values.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  style={{
                    width: 20,
                    height: 20,
                    cursor: 'pointer',
                  }}
                />
                <label htmlFor="is_active" style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Active Product
                </label>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                Active products are visible to customers and can be purchased.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Product Images
              </Typography>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="textSecondary" mb={1}>
                    Current Images:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {existingImages.map((image) => (
                      <Box key={image.id} sx={{ position: 'relative' }}>
                        <img
                          src={ImageUtils.getFullImageUrl(image.image)}
                          alt="Product"
                          style={{
                            height: 120,
                            width: 120,
                            objectFit: 'cover',
                            borderRadius: 8,
                          }}
                          onError={(e) => {
                            e.target.src = ImageUtils.getPlaceholderImage();
                          }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => removeExistingImage(image.id)}
                          sx={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            minWidth: '24px',
                            width: '24px',
                            height: '24px',
                            padding: 0,
                            borderRadius: '50%',
                            fontSize: '16px',
                            lineHeight: 1,
                          }}
                        >
                          &times;
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="textSecondary" mb={1}>
                    New Images to Upload:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {selectedImages.map((file, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          style={{
                            height: 120,
                            width: 120,
                            objectFit: 'cover',
                            borderRadius: 8,
                          }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => removeSelectedImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            minWidth: '24px',
                            width: '24px',
                            height: '24px',
                            padding: 0,
                            borderRadius: '50%',
                            fontSize: '16px',
                            lineHeight: 1,
                          }}
                        >
                          &times;
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {(existingImages.length + selectedImages.length) < 5 && (
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="primary"
                    fontWeight="bold"
                    mt={1}
                    display="block"
                  >
                    <i className="bi bi-info-circle me-1"></i> Required: Exactly 500×500px
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block" mb={1}>
                    Upload up to 5 images (JPEG, PNG, GIF). Only accept 500×500px dimensions. Maximum 5MB per image.
                    Currently: {existingImages.length + selectedImages.length}/5 images
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant="outlined" onClick={() => navigate('/products')} sx={{ borderRadius: 2 }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="error"
                disabled={isSubmitting || uploadingImages}
                sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
              >
                {isSubmitting || uploadingImages ? (
                  <>
                    <CircularProgress size={20} sx={{ color: 'inherit', mr: 1 }} />
                    {uploadingImages ? 'Uploading Images...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {isEditing ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductForm;
