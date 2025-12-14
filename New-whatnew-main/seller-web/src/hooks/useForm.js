import { useState } from 'react';

// Styled error message for Material UI forms
export const ErrorText = ({ children }) => (
  <span
    style={{
      color: '#e63946',
      fontWeight: 500,
      fontSize: '0.95em',
      marginTop: 4,
      display: 'block',
      letterSpacing: 0.1,
      textAlign: 'left'
    }}
  >
    {children}
  </span>
);

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) return error;
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  };

  const setFieldValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setErrors,
    setFieldValue,
    ErrorText // Export for use in forms
  };
};

// Common validation rules
export const validationRules = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return '';
  },
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  },
  
  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return '';
  },
  
  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return '';
  },
  
  phone: (value) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (value && !phoneRegex.test(value)) {
      return 'Please enter a valid 10-digit phone number';
    }
    return '';
  },
  
  aadhar: (value) => {
    const aadharRegex = /^\d{12}$/;
    if (value && !aadharRegex.test(value)) {
      return 'Please enter a valid 12-digit Aadhar number';
    }
    return '';
  },
  
  pan: (value) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (value && !panRegex.test(value)) {
      return 'Please enter a valid PAN number (e.g., ABCDE1234F)';
    }
    return '';
  },
  
  price: (value) => {
    if (value && (isNaN(value) || parseFloat(value) <= 0)) {
      return 'Please enter a valid price greater than 0';
    }
    return '';
  },
  
  stock: (value) => {
    if (value && (isNaN(value) || parseInt(value) < 0)) {
      return 'Please enter a valid stock quantity';
    }
    return '';
  }
};
