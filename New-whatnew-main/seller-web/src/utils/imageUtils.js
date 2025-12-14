/**
 * Utility functions for handling image URLs in the seller web app
 */

const API_BASE_URL = 'http://192.168.1.42:8000';

export const ImageUtils = {
  /**
   * Converts a relative image URL to an absolute URL
   * @param {string|null} imageUrl - The image URL from the API
   * @returns {string} - The full image URL or empty string
   */
  getFullImageUrl: (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return '';
    }
    
    // If URL is already absolute, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If URL starts with /, it's a relative URL from the server
    if (imageUrl.startsWith('/')) {
      return `${API_BASE_URL}${imageUrl}`;
    }
    
    // If URL doesn't start with /, prepend /media/ (common media path)
    return `${API_BASE_URL}/media/${imageUrl}`;
  },

  /**
   * Get placeholder image URL for when images fail to load
   * @returns {string} - Placeholder image URL
   */
  getPlaceholderImage: () => '/placeholder.svg',

  /**
   * Check if an image URL is valid (not null, not empty)
   * @param {string|null} imageUrl - The image URL to check
   * @returns {boolean} - Whether the URL is valid
   */
  isValidImageUrl: (imageUrl) => {
    return imageUrl != null && imageUrl !== '' && typeof imageUrl === 'string';
  },

  /**
   * Get the primary image URL from a product object
   * @param {object} product - The product object
   * @returns {string} - The primary image URL or placeholder
   */
  getProductImageUrl: (product) => {
    // Try primary image first
    if (product?.primary_image?.image) {
      return ImageUtils.getFullImageUrl(product.primary_image.image);
    }
    
    // Try first image in images array
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      return ImageUtils.getFullImageUrl(product.images[0].image);
    }
    
    // Return placeholder
    return ImageUtils.getPlaceholderImage();
  },

  /**
   * Validate image dimensions for livestream thumbnail
   * @param {File} file - The image file to validate
   * @returns {Promise<{isValid: boolean, aspectRatio: number, width: number, height: number, message?: string}>}
   */
  validateImageDimensions: (file) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve({
          isValid: false,
          aspectRatio: 0,
          width: 0,
          height: 0,
          message: 'Please select a valid image file'
        });
        return;
      }

      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const aspectRatio = width / height;
        
        // Check for exact dimensions: 480x720
        const isValid = (width === 480 && height === 720);
        
        resolve({
          isValid,
          aspectRatio,
          width,
          height,
          message: isValid 
            ? `Perfect! Image dimensions: ${width}×${height}px` 
            : `Image must be exactly 480×720px. Current size: ${width}×${height}px`
        });
      };

      img.onerror = () => {
        resolve({
          isValid: false,
          aspectRatio: 0,
          width: 0,
          height: 0,
          message: 'Failed to load image for validation'
        });
      };

      // Create object URL for the image
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Validate image dimensions for product images
   * @param {File} file - The image file to validate
   * @returns {Promise<{isValid: boolean, aspectRatio: number, width: number, height: number, message?: string}>}
   */
  validateProductImageDimensions: (file) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve({
          isValid: false,
          aspectRatio: 0,
          width: 0,
          height: 0,
          message: 'Please select a valid image file'
        });
        return;
      }

      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const aspectRatio = width / height;
        
        // Check for exact dimensions: 500x500
        const isValid = (width === 500 && height === 500);
        
        resolve({
          isValid,
          aspectRatio,
          width,
          height,
          message: isValid 
            ? `Perfect! Product image dimensions: ${width}×${height}px` 
            : `Product image must be exactly 500×500px. Current size: ${width}×${height}px`
        });
      };

      img.onerror = () => {
        resolve({
          isValid: false,
          aspectRatio: 0,
          width: 0,
          height: 0,
          message: 'Failed to load image for validation'
        });
      };

      // Create object URL for the image
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Get recommended image sizes for livestream thumbnails
   * @returns {Array} - Array of accepted sizes
   */
  getRecommendedSizes: () => [
    { width: 480, height: 720, label: 'Required (480×720px)' }
  ],

  /**
   * Get recommended image sizes for product images
   * @returns {Array} - Array of accepted sizes
   */
  getProductImageSizes: () => [
    { width: 500, height: 500, label: 'Required (500×500px)' }
  ],

  /**
   * Calculate 480x720 dimensions (for livestream thumbnails)
   * @param {number} maxWidth - The maximum width constraint
   * @returns {object} - Width and height for 480x720 ratio
   */
  calculateLivestreamDimensions: (maxWidth = 480) => {
    const aspectRatio = 480 / 720; // 2:3 ratio (portrait)
    const width = Math.min(maxWidth, 480);
    const height = Math.round(width / aspectRatio);
    return { width, height };
  },

  /**
   * Format aspect ratio for display
   * @param {number} ratio - The aspect ratio number
   * @returns {string} - Formatted ratio string
   */
  formatAspectRatio: (ratio) => {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const width = Math.round(ratio * 1000);
    const height = 1000;
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  }
};

export default ImageUtils;
