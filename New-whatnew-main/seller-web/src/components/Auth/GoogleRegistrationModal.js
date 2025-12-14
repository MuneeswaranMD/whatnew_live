import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { authService } from '../../services/auth';

const GoogleRegistrationModal = ({ show, onHide, userInfo, accessToken, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    phone_number: '',
    shop_name: '',
    shop_address: '',
    aadhar_number: '',
    pan_number: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' });
  const [usernameDebounceTimer, setUsernameDebounceTimer] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setFormData({
        username: '',
        phone_number: '',
        shop_name: '',
        shop_address: '',
        aadhar_number: '',
        pan_number: ''
      });
      setErrors({});
      setAlert(null);
      setUsernameStatus({ checking: false, available: null, message: '' });
    }
  }, [show]);

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: '' });
      return;
    }

    setUsernameStatus({ checking: true, available: null, message: 'Checking availability...' });

    try {
      const response = await authService.checkUsernameAvailability(username);
      if (response.available) {
        setUsernameStatus({ 
          checking: false, 
          available: true, 
          message: 'Username is available!' 
        });
      } else {
        setUsernameStatus({ 
          checking: false, 
          available: false, 
          message: 'Username is already taken' 
        });
      }
    } catch (error) {
      console.error('Username availability check error:', error);
      setUsernameStatus({ 
        checking: false, 
        available: null, 
        message: 'Error checking username availability' 
      });
    }
  };

  const handleUsernameChange = (value) => {
    setFormData(prev => ({ ...prev, username: value }));
    
    // Clear previous timer
    if (usernameDebounceTimer) {
      clearTimeout(usernameDebounceTimer);
    }

    // Set new timer for debounced check
    const timer = setTimeout(() => {
      checkUsernameAvailability(value);
    }, 500);
    
    setUsernameDebounceTimer(timer);
  };

  const handleInputChange = (field, value) => {
    if (field === 'username') {
      handleUsernameChange(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear errors for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (usernameStatus.available === false) {
      newErrors.username = 'Username is already taken';
    }

    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    if (!formData.shop_name) {
      newErrors.shop_name = 'Shop name is required';
    }

    if (!formData.shop_address) {
      newErrors.shop_address = 'Shop address is required';
    }

    if (!formData.aadhar_number) {
      newErrors.aadhar_number = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadhar_number.replace(/\s/g, ''))) {
      newErrors.aadhar_number = 'Aadhar number must be 12 digits';
    }

    if (!formData.pan_number) {
      newErrors.pan_number = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number.toUpperCase())) {
      newErrors.pan_number = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (usernameStatus.available !== true) {
      setAlert({
        type: 'danger',
        message: 'Please ensure username is available before submitting'
      });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);

    try {
      // Prepare registration data
      const registrationData = {
        username: formData.username,
        phone_number: formData.phone_number,
        shop_name: formData.shop_name,
        shop_address: formData.shop_address,
        aadhar_number: formData.aadhar_number,
        pan_number: formData.pan_number.toUpperCase()
      };

      // Register with Google
      await authService.googleRegister(accessToken, registrationData);
      
      // Close modal and notify parent
      onHide();
      onSuccess(registrationData);
    } catch (error) {
      console.error('Google registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.username) {
        errorMessage = `Username error: ${error.response.data.username[0]}`;
      } else if (error.response?.data?.phone_number) {
        errorMessage = `Phone number error: ${error.response.data.phone_number[0]}`;
      } else if (error.response?.data?.aadhar_number) {
        errorMessage = `Aadhar number error: ${error.response.data.aadhar_number[0]}`;
      } else if (error.response?.data?.pan_number) {
        errorMessage = `PAN number error: ${error.response.data.pan_number[0]}`;
      }
      
      setAlert({
        type: 'danger',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className='bg-black'>
        <Modal.Title >Complete Your Seller Registration</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-black text-white'>
        {alert && (
          <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
            {alert.message}
          </Alert>
        )}

        <div className="text-center mb-4 bg-black">
          <p className="text-muted">
            Welcome! We've received your Google account information.
            Please provide additional details to complete your seller registration.
          </p>
          {userInfo && (
            <div className="bg-light p-3 rounded bg-black text-white">
              <strong>Google Account:</strong> {userInfo.email}
              <br />
              <strong>Name:</strong> {userInfo.first_name} {userInfo.last_name}
            </div>
          )}
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Username *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-person"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    isInvalid={!!errors.username}
                    placeholder="Choose a unique username"
                  />
                  {usernameStatus.checking && (
                    <InputGroup.Text>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    </InputGroup.Text>
                  )}
                  {!usernameStatus.checking && usernameStatus.available === true && (
                    <InputGroup.Text className="text-success">
                      <i className="bi bi-check-circle"></i>
                    </InputGroup.Text>
                  )}
                  {!usernameStatus.checking && usernameStatus.available === false && (
                    <InputGroup.Text className="text-danger">
                      <i className="bi bi-x-circle"></i>
                    </InputGroup.Text>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </InputGroup>
                {usernameStatus.message && (
                  <Form.Text className={`d-block ${
                    usernameStatus.available === true ? 'text-success' : 
                    usernameStatus.available === false ? 'text-danger' : 'text-muted'
                  }`}>
                    {usernameStatus.message}
                  </Form.Text>
                )}
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Phone Number *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-telephone"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    isInvalid={!!errors.phone_number}
                    placeholder="Enter your phone number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone_number}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Shop Name *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-shop"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={formData.shop_name}
                    onChange={(e) => handleInputChange('shop_name', e.target.value)}
                    isInvalid={!!errors.shop_name}
                    placeholder="Enter your shop name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.shop_name}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Shop Address *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-geo-alt"></i>
                  </InputGroup.Text>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.shop_address}
                    onChange={(e) => handleInputChange('shop_address', e.target.value)}
                    isInvalid={!!errors.shop_address}
                    placeholder="Enter your shop address"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.shop_address}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Aadhar Number *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-card-text"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={formData.aadhar_number}
                    onChange={(e) => handleInputChange('aadhar_number', e.target.value)}
                    isInvalid={!!errors.aadhar_number}
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength={12}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.aadhar_number}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>PAN Number *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-credit-card"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={formData.pan_number}
                    onChange={(e) => handleInputChange('pan_number', e.target.value.toUpperCase())}
                    isInvalid={!!errors.pan_number}
                    placeholder="Enter PAN number (e.g., ABCDE1234F)"
                    maxLength={10}
                    style={{ textTransform: 'uppercase' }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pan_number}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className='bg-black'>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={isSubmitting || usernameStatus.available !== true}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Registering...
            </>
          ) : (
            'Complete Registration'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GoogleRegistrationModal;
