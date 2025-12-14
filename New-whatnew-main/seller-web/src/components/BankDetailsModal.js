import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Typography, Box, CircularProgress } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import Alert from './Common/Alert';
import { paymentService } from '../services/payments';

const BankDetailsModal = ({ show, onHide, bankDetails, onUpdate }) => {
  const [formData, setFormData] = useState({
    account_holder_name: bankDetails?.account_holder_name || '',
    bank_name: bankDetails?.bank_name || '',
    bank_account_number: '',
    confirm_account_number: '',
    bank_ifsc_code: bankDetails?.ifsc_code || '',
    confirm_ifsc_code: '',
    mobile_number: bankDetails?.mobile_number || ''
  });
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'bank_ifsc_code' || name === 'confirm_ifsc_code') {
      processedValue = value.toUpperCase();
    }
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (formData.bank_account_number !== formData.confirm_account_number) {
      setAlert({
        type: 'danger',
        message: 'Account numbers do not match'
      });
      return;
    }
    if (formData.bank_ifsc_code.toUpperCase() !== formData.confirm_ifsc_code.toUpperCase()) {
      setAlert({
        type: 'danger',
        message: 'IFSC codes do not match'
      });
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.mobile_number)) {
      setAlert({
        type: 'danger',
        message: 'Mobile number must be 10 digits'
      });
      return;
    }
    if (formData.bank_ifsc_code.length < 8 || formData.bank_ifsc_code.length > 15) {
      setAlert({
        type: 'danger',
        message: 'IFSC code must be between 8-15 characters'
      });
      return;
    }

    try {
      setSubmitting(true);
      await paymentService.updateBankDetails(formData);
      setAlert({
        type: 'success',
        message: 'Bank details updated successfully'
      });
      onUpdate();
      setTimeout(() => {
        onHide();
      }, 2000);
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.error || 'Failed to update bank details. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={onHide}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'linear-gradient(135deg, #fff 60%, #f7f7fa 100%)',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#e63946', fontWeight: 700 }}>
        <AccountBalanceIcon sx={{ color: '#e63946', mr: 1 }} />
        Update Bank Details
        <Box flex={1} />
        <Button onClick={onHide} sx={{ minWidth: 0, color: '#888' }}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent dividers sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            sx={{ mb: 2, maxWidth: 500, mx: 'auto', textAlign: 'center' }}
          />
        )}
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Holder Name *"
                name="account_holder_name"
                value={formData.account_holder_name}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="off"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Bank Name *"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="off"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Number *"
                name="bank_account_number"
                value={formData.bank_account_number}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="off"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Account Number *"
                name="confirm_account_number"
                value={formData.confirm_account_number}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="off"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="IFSC Code *"
                name="bank_ifsc_code"
                value={formData.bank_ifsc_code}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="off"
                variant="outlined"
                sx={{ mb: 1, textTransform: 'uppercase' }}
                inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 11 }}
                helperText="11 characters (auto uppercase)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm IFSC Code *"
                name="confirm_ifsc_code"
                value={formData.confirm_ifsc_code}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="off"
                variant="outlined"
                sx={{ mb: 1, textTransform: 'uppercase' }}
                inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 11 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number *"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="off"
                variant="outlined"
                sx={{ mb: 1 }}
                inputProps={{ maxLength: 10, pattern: '[0-9]{10}' }}
                helperText="10 digits"
              />
            </Grid>
          </Grid>
          <DialogActions sx={{ mt: 3, px: 0, justifyContent: 'flex-end' }}>
            <Button
              onClick={onHide}
              color="secondary"
              variant="outlined"
              disabled={submitting}
              sx={{ minWidth: 120, fontWeight: 700 }}
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: '#e63946',
                color: '#fff',
                fontWeight: 700,
                minWidth: 180,
                '&:hover': { background: '#b71c1c' }
              }}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
            >
              {submitting ? 'Updating...' : 'Update Bank Details'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BankDetailsModal;
