export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateOnly = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getStatusBadgeClass = (status) => {
  const statusClasses = {
    'pending': 'bg-warning',
    'confirmed': 'bg-success',
    'shipped': 'bg-info',
    'delivered': 'bg-primary',
    'cancelled': 'bg-danger',
    'returned': 'bg-secondary',
    'live': 'bg-success',
    'scheduled': 'bg-warning',
    'ended': 'bg-secondary',
    'active': 'bg-success',
    'inactive': 'bg-secondary',
    'sold_out': 'bg-warning',
    'verified': 'bg-success',
    'pending_verification': 'bg-warning',
    'rejected': 'bg-danger'
  };
  
  return statusClasses[status] || 'bg-secondary';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateImageFile = async (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, or GIF)';
  }
  
  if (file.size > maxSize) {
    return 'Image size should be less than 5MB';
  }

  // Check dimensions for product images (500x500)
  try {
    const { ImageUtils } = await import('./imageUtils');
    const validation = await ImageUtils.validateProductImageDimensions(file);
    
    if (!validation.isValid) {
      return validation.message;
    }
  } catch (error) {
    console.error('Error validating image dimensions:', error);
    return 'Error validating image dimensions';
  }
  
  return null;
};

export const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
