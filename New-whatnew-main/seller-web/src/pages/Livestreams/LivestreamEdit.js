import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { livestreamService } from '../../services/livestream';
import { productService } from '../../services/products';
import { useForm, validationRules } from '../../hooks/useForm';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { ImageUtils } from '../../utils/imageUtils';
import './Livestreams.css';

const LivestreamEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [alert, setAlert] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [thumbnailValidation, setThumbnailValidation] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState(null);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues
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
  }, [id]);

  const loadData = async () => {
    try {
      setInitialLoading(true);
      
      // Load livestream data, products, and categories in parallel
      const [livestreamData, productsResponse, categoriesResponse] = await Promise.all([
        livestreamService.getLivestream(id),
        productService.getMyProducts(),
        productService.getCategories()
      ]);
      
      console.log('LivestreamEdit: Livestream data:', livestreamData);
      console.log('LivestreamEdit: Products response:', productsResponse);
      console.log('LivestreamEdit: Categories response:', categoriesResponse);
      
      // Set livestream data
      if (livestreamData) {
        setValues({
          title: livestreamData.title || '',
          description: livestreamData.description || '',
          category: livestreamData.category || '',
          scheduled_time: livestreamData.scheduled_start_time 
            ? new Date(livestreamData.scheduled_start_time).toISOString().slice(0, 16)
            : '',
          is_scheduled: !!livestreamData.scheduled_start_time
        });

        // Set existing thumbnail
        if (livestreamData.thumbnail) {
          setExistingThumbnail(livestreamData.thumbnail);
          setThumbnailPreview(livestreamData.thumbnail);
        }

        // Set selected products
        if (livestreamData.products && Array.isArray(livestreamData.products)) {
          const productIds = livestreamData.products.map(p => 
            typeof p === 'object' ? p.id : p
          );
          setSelectedProducts(productIds);
        }
      }
      
      // Set products
      const productsArray = Array.isArray(productsResponse) 
        ? productsResponse 
        : (productsResponse?.results || productsResponse?.data || []);
      console.log('LivestreamEdit: Products array:', productsArray);
      setProducts(productsArray);
      
      // Set categories
      const categoriesArray = Array.isArray(categoriesResponse) 
        ? categoriesResponse 
        : (categoriesResponse?.results || categoriesResponse?.data || []);
      setCategories(categoriesArray);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to load livestream data. Please try again.'
      });
    } finally {
      setInitialLoading(false);
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
      // Validate exact dimensions
      const validation = await ImageUtils.validateImageDimensions(file);
      setThumbnailValidation(validation);
      
      if (!validation.isValid) {
        setThumbnailError(validation.message);
        setThumbnailFile(null);
        setThumbnailPreview(existingThumbnail);
        return;
      }
      
      setThumbnailFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(existingThumbnail);
    setThumbnailError(null);
    setThumbnailValidation(null);
    // Reset the file input
    const fileInput = document.getElementById('thumbnail');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const onSubmit = async (formData) => {
    try {
      if (selectedProducts.length === 0) {
        setAlert({
          type: 'warning',
          message: 'Please select at least one product for the livestream.'
        });
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      
      // Add each product ID separately
      selectedProducts.forEach(productId => {
        formDataToSend.append('products', productId);
      });
      
      if (formData.is_scheduled && formData.scheduled_time) {
        formDataToSend.append('scheduled_start_time', formData.scheduled_time);
      }
      
      // Only append thumbnail if a new one was selected
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      console.log('LivestreamEdit: Updating livestream with data:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        products: selectedProducts,
        scheduled_start_time: formData.is_scheduled ? formData.scheduled_time : null,
        thumbnail: thumbnailFile ? thumbnailFile.name : 'unchanged'
      });

      const response = await livestreamService.updateLivestream(id, formDataToSend);
      
      setAlert({
        type: 'success',
        message: 'Livestream updated successfully!'
      });

      setTimeout(() => {
        navigate('/livestreams');
      }, 1500);
    } catch (error) {
      console.error('Error updating livestream:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to update livestream. Please try again.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else {
          // Handle field-specific errors
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

  if (initialLoading) {
    return <LoadingSpinner text="Loading livestream data..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-pencil me-2"></i>
                Edit Livestream
              </h4>
            </div>
            <div className="card-body p-4">
              {alert && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                  className="mb-4"
                />
              )}

              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit);
              }}>
                {/* Basic Information */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="text-primary border-bottom pb-2 mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Basic Information
                    </h5>
                  </div>
                  
                  <div className="col-md-8 mb-3">
                    <label htmlFor="title" className="form-label">
                      Livestream Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      id="title"
                      value={values.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Enter an engaging title for your livestream"
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label htmlFor="category" className="form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                      id="category"
                      value={values.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <div className="invalid-feedback">{errors.category}</div>
                    )}
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label htmlFor="description" className="form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      id="description"
                      rows="4"
                      value={values.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe what viewers can expect from your livestream"
                    ></textarea>
                    {errors.description && (
                      <div className="invalid-feedback">{errors.description}</div>
                    )}
                  </div>

                  <div className="col-12 mb-3">
                    <label htmlFor="thumbnail" className="form-label">
                      Thumbnail Image
                      {!existingThumbnail && <span className="text-danger">*</span>}
                    </label>
                    <div className="row">
                      <div className="col-md-8">
                        <input
                          type="file"
                          className={`form-control ${thumbnailError ? 'is-invalid' : ''}`}
                          id="thumbnail"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                        />
                        <div className="mt-2">
                          <small className="form-text text-primary fw-bold">
                            <i className="bi bi-info-circle me-1"></i>
                            Required: Exactly 480×720px
                          </small>
                          <br />
                          <small className="form-text text-muted">
                            {existingThumbnail ? 'Upload a new image to replace the current thumbnail' : 'Only accept 480×720px dimensions'}
                          </small>
                        </div>
                        {thumbnailError && (
                          <div className="invalid-feedback d-block">
                            {thumbnailError}
                          </div>
                        )}
                        {thumbnailValidation && thumbnailValidation.isValid && (
                          <div className="text-success small mt-1">
                            <i className="bi bi-check-circle me-1"></i>
                            {thumbnailValidation.message}
                          </div>
                        )}
                      </div>
                      <div className="col-md-4">
                        {thumbnailPreview && (
                          <div className="position-relative">
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail preview"
                              className="img-thumbnail thumbnail-preview"
                            />
                            {thumbnailFile && (
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                style={{ transform: 'translate(25%, -25%)' }}
                                onClick={removeThumbnail}
                                title="Remove new thumbnail"
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            )}
                            {existingThumbnail && !thumbnailFile && (
                              <div className="position-absolute top-0 start-0 m-1">
                                <span className="badge bg-info">
                                  <i className="bi bi-image"></i> Current
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        {!thumbnailPreview && (
                          <div 
                            className="thumbnail-preview-container d-flex align-items-center justify-content-center text-muted"
                            style={{ 
                              width: '160px',
                              height: '240px'
                            }}
                          >
                            <div className="text-center">
                              <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
                              <div className="small mt-2">480×720px Preview</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="text-primary border-bottom pb-2 mb-3">
                      <i className="bi bi-calendar-event me-2"></i>
                      Schedule
                    </h5>
                  </div>
                  
                  <div className="col-12 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="is_scheduled"
                        checked={values.is_scheduled}
                        onChange={(e) => setFieldValue('is_scheduled', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="is_scheduled">
                        Schedule for later (otherwise available immediately)
                      </label>
                    </div>
                  </div>
                  
                  {values.is_scheduled && (
                    <div className="col-md-6 mb-3">
                      <label htmlFor="scheduled_time" className="form-label">
                        Scheduled Time <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="scheduled_time"
                        value={values.scheduled_time}
                        onChange={(e) => handleChange('scheduled_time', e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      <small className="form-text text-muted">
                        Select when you want to start the livestream
                      </small>
                    </div>
                  )}
                </div>

                {/* Product Selection */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="text-primary border-bottom pb-2 mb-3">
                      <i className="bi bi-box-seam me-2"></i>
                      Select Products for Bidding
                    </h5>
                  </div>
                  
                  {(!products || products.length === 0) ? (
                    <div className="col-12">
                      <div className="alert alert-warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        You don't have any products yet. 
                        <a href="/products/create" className="alert-link ms-2">Create your first product</a>
                      </div>
                    </div>
                  ) : (
                    <div className="col-12">
                      <p className="text-muted mb-3">
                        Select the products you want to feature in this livestream. 
                        You can start bidding for these products during the live session.
                      </p>
                      
                      <div className="row">
                        {(products || []).map((product) => (
                          <div key={product.id} className="col-md-6 col-lg-4 mb-3">
                            <div 
                              className={`card h-100 product-selection-card ${selectedProducts.includes(product.id) ? 'selected border-primary' : ''}`}
                              onClick={() => handleProductSelection(product.id)}
                            >
                              <div className="product-image-container position-relative">
                                <img 
                                  src={ImageUtils.getProductImageUrl(product)}
                                  className="card-img-top" 
                                  alt={product.name}
                                  style={{ height: '200px', objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.src = ImageUtils.getPlaceholderImage();
                                  }}
                                />
                                <div className="product-badges">
                                  <div>
                                    {product.stock_quantity === 0 && (
                                      <span className="badge bg-danger">
                                        <i className="bi bi-exclamation-triangle me-1"></i>
                                        Out of Stock
                                      </span>
                                    )}
                                    {product.is_active === false && (
                                      <span className="badge bg-secondary ms-1">
                                        <i className="bi bi-pause-circle me-1"></i>
                                        Inactive
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    {selectedProducts.includes(product.id) && (
                                      <span className="badge bg-primary">
                                        <i className="bi bi-check-circle"></i>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="card-body product-card-body">
                                <div className="product-card-content">
                                  <h6 className="card-title mb-2">{product.name}</h6>
                                  <p className="card-text small text-muted">
                                    {(product.description && product.description.length > 60) 
                                      ? `${product.description.substring(0, 60)}...` 
                                      : (product.description || 'No description available')
                                    }
                                  </p>
                                </div>
                                <div className="product-card-footer">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="product-price">
                                      ₹{parseFloat(product.base_price || product.price || 0).toLocaleString('en-IN')}
                                    </span>
                                    <span className={`badge product-stock-badge ${
                                      (product.stock_quantity || product.available_quantity || 0) > 10 
                                        ? 'stock-high' 
                                        : (product.stock_quantity || product.available_quantity || 0) > 0 
                                          ? 'stock-medium' 
                                          : 'stock-low'
                                    }`}>
                                      <i className="bi bi-box me-1"></i>
                                      {product.stock_quantity || product.available_quantity || 0}
                                    </span>
                                  </div>
                                  <div className="product-info-row">
                                    <div className="d-flex justify-content-between align-items-center text-muted small">
                                      <span>
                                        <i className="bi bi-tag me-1"></i>
                                        {product.category_name || 'Uncategorized'}
                                      </span>
                                      <span>
                                        <i className="bi bi-calendar me-1"></i>
                                        {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {selectedProducts.length > 0 && (
                        <div className="alert alert-info mt-3">
                          <i className="bi bi-info-circle me-2"></i>
                          {selectedProducts.length} product(s) selected for this livestream
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/livestreams')}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || products.length === 0 || thumbnailError}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Update Livestream
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestreamEdit;
