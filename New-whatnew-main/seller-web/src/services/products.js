import api from './api';

export const productService = {
  // Get categories
  getCategories: async () => {
    const response = await api.get('/api/products/categories/');
    return response.data;
  },

  // Get products (with query parameters)
  getProducts: async (params = {}) => {
    const response = await api.get('/api/products/products/', { params });
    return response.data;
  },

  // Get products for a specific livestream
  getProductsForLivestream: async (livestreamId) => {
    const response = await api.get(`/api/livestreams/livestreams/${livestreamId}/products/`);
    return response.data;
  },

  // Get my products (seller's products)
  getMyProducts: async () => {
    const response = await api.get('/api/products/products/my_products/');
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/api/products/products/${id}/`);
    return response.data;
  },

  // Create product
  createProduct: async (productData) => {
    const response = await api.post('/api/products/products/', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/api/products/products/${id}/`, productData);
    return response.data;
  },

  // Partial update product
  updateProductPartial: async (id, productData) => {
    const response = await api.patch(`/api/products/products/${id}/`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    await api.delete(`/api/products/products/${id}/`);
  },

  // Upload product image
  uploadProductImage: async (productId, imageFile) => {
    console.log('ProductService: uploadProductImage called with productId:', productId, 'imageFile:', imageFile.name);
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const url = `/api/products/products/${productId}/images/`;
    console.log('ProductService: Making request to URL:', url);
    
    const response = await api.post(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('ProductService: Upload response:', response.data);
    return response.data;
  },

  // Get product images
  getProductImages: async (productId) => {
    const response = await api.get(`/api/products/products/${productId}/images/`);
    return response.data;
  },

  // Delete product image
  deleteProductImage: async (imageId) => {
    await api.delete(`/api/products/images/${imageId}/`);
  }
};
