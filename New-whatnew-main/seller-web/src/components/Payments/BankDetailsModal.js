import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/payments';

const BankDetailsModal = ({ show, onHide, bankDetails, onUpdate }) => {
  const [formData, setFormData] = useState({
    bank_account_number: '',
    confirm_account_number: '',
    bank_ifsc_code: '',
    confirm_ifsc_code: '',
    bank_name: '',
    account_holder_name: '',
    mobile_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bankDetails && show) {
      setFormData({
        bank_account_number: bankDetails.account_number || '',
        confirm_account_number: bankDetails.account_number || '',
        bank_ifsc_code: bankDetails.ifsc_code || '',
        confirm_ifsc_code: bankDetails.ifsc_code || '',
        bank_name: bankDetails.bank_name || '',
        account_holder_name: bankDetails.account_holder_name || '',
        mobile_number: bankDetails.mobile_number || ''
      });
    }
  }, [bankDetails, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.bank_account_number !== formData.confirm_account_number) {
      setError('Account numbers do not match');
      return;
    }
    
    if (formData.bank_ifsc_code !== formData.confirm_ifsc_code) {
      setError('IFSC codes do not match');
      return;
    }

    try {
      setLoading(true);
      await paymentService.updateBankDetails(formData);
      onUpdate(); // Refresh parent data
      onHide();
    } catch (error) {
      console.error('Error updating bank details:', error);
      setError(error.response?.data?.error || 'Failed to update bank details');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: 'linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-100) 100%)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content" style={{background: 'linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-100) 100%)'}}>
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-bank me-2"></i>
              {bankDetails ? 'Update Bank Details' : 'Add Bank Details'}
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Account Holder Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="account_holder_name"
                    value={formData.account_holder_name}
                    onChange={handleChange}
                    placeholder="Enter account holder name"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Bank Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    placeholder="Enter bank name"
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Account Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Confirm Account Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="confirm_account_number"
                    value={formData.confirm_account_number}
                    onChange={handleChange}
                    placeholder="Re-enter account number"
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">IFSC Code *</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    name="bank_ifsc_code"
                    value={formData.bank_ifsc_code}
                    onChange={handleChange}
                    placeholder="Enter IFSC code"
                    style={{ textTransform: 'uppercase' }}
                    maxLength="11"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Confirm IFSC Code *</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    name="confirm_ifsc_code"
                    value={formData.confirm_ifsc_code}
                    onChange={handleChange}
                    placeholder="Re-enter IFSC code"
                    style={{ textTransform: 'uppercase' }}
                    maxLength="11"
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>

              <div className="alert alert-info" role="alert">
                <small>
                  <i className="bi bi-info-circle me-2"></i>
                  Ensure all details are correct as they will be used for fund transfers.
                </small>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onHide}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Save Bank Details
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsModal;
