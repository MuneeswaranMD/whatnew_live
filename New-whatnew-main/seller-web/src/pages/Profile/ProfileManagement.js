import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Divider,
  Tooltip,
  Paper,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ProfileManagement = ({ refreshUser }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    shop_name: '',
    shop_address: ''
  });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      setProfile(response);

      setFormData({
        first_name: response.first_name || '',
        last_name: response.last_name || '',
        email: response.email || '',
        phone_number: response.phone_number || '',
        shop_name: response.profile?.shop_name || '',
        shop_address: response.profile?.shop_address || ''
      });
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Failed to load profile data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await authService.updateProfile(formData);
      setAlert({
        type: 'success',
        message: 'Profile updated successfully!'
      });
      fetchProfile();
      if (refreshUser) refreshUser();
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.error || 'Failed to update profile. Please try again.'
      });
    } finally {
      setUpdating(false);
    }
  };

  const getVerificationStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <Chip
            icon={<VerifiedUserIcon />}
            label="Verified"
            color="success"
            sx={{ fontWeight: 700 }}
          />
        );
      case 'pending':
        return (
          <Chip
            icon={<HourglassEmptyIcon />}
            label="Pending Verification"
            color="warning"
            sx={{ fontWeight: 700 }}
          />
        );
      case 'rejected':
        return (
          <Chip
            icon={<CancelIcon />}
            label="Rejected"
            color="error"
            sx={{ fontWeight: 700 }}
          />
        );
      default:
        return (
          <Chip
            icon={<ShieldIcon />}
            label="Not Submitted"
            color="default"
            sx={{ fontWeight: 700 }}
          />
        );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box
      sx={{
        background: '#f7f7fa',
        minHeight: '100vh',
        py: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 1, md: 3 }, width: '100%' }}>
        <Stack direction="row" justifyContent="center" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#e63946', textAlign: 'center' }}>
            Profile Management
          </Typography>
        </Stack>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            sx={{ mb: 3, maxWidth: 600, mx: 'auto', textAlign: 'center' }}
          />
        )}

        <Grid container spacing={3} justifyContent="center">
          {/* Profile Form */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderTop: '4px solid #e63946', borderRadius: 0 }}>
              <CardHeader
                avatar={<PersonIcon sx={{ color: '#e63946' }} />}
                title={
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#e63946', textAlign: 'center' }}>
                    Update Profile Information
                  </Typography>
                }
                sx={{ pb: 0, textAlign: 'center' }}
              />
              <CardContent>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First Name"
                        value={formData.first_name}
                        onChange={e => handleInputChange('first_name', e.target.value)}
                        fullWidth
                        required
                        autoComplete="given-name"
                        sx={{ '& label.Mui-focused': { color: '#e63946' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        value={formData.last_name}
                        onChange={e => handleInputChange('last_name', e.target.value)}
                        fullWidth
                        required
                        autoComplete="family-name"
                        sx={{ '& label.Mui-focused': { color: '#e63946' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        fullWidth
                        required
                        autoComplete="email"
                        sx={{ '& label.Mui-focused': { color: '#e63946' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Phone Number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={e => handleInputChange('phone_number', e.target.value)}
                        fullWidth
                        required
                        autoComplete="tel"
                        sx={{ '& label.Mui-focused': { color: '#e63946' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Shop Name"
                        value={formData.shop_name}
                        onChange={e => handleInputChange('shop_name', e.target.value)}
                        fullWidth
                        required
                        sx={{ '& label.Mui-focused': { color: '#e63946' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Shop Address"
                        value={formData.shop_address}
                        onChange={e => handleInputChange('shop_address', e.target.value)}
                        fullWidth
                        required
                        multiline
                        minRows={3}
                        sx={{ '& label.Mui-focused': { color: '#e63946' } }}
                      />
                    </Grid>
                  </Grid>
                  <Stack direction="row" spacing={2} mt={4} justifyContent="center">
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        background: '#e63946',
                        color: '#fff',
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        '&:hover': { background: '#b71c1c' }
                      }}
                      disabled={updating}
                      startIcon={<CheckCircleIcon />}
                    >
                      {updating ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Account Information */}
          <Grid item xs={12} md={5}>
            <Card sx={{ borderTop: '4px solid #e63946', borderRadius: 0 }}>
              <CardHeader
                avatar={<PersonIcon sx={{ color: '#e63946' }} />}
                title={
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#e63946', textAlign: 'center' }}>
                    Account Information
                  </Typography>
                }
                sx={{ pb: 0, textAlign: 'center' }}
              />
              <CardContent>
                <Stack spacing={2} alignItems="center">
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">Username</Typography>
                    <Typography sx={{ color: '#e63946', fontWeight: 700 }}>{profile?.username}</Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">User Type</Typography>
                    <Chip label="Seller" sx={{ background: '#e63946', color: '#fff', fontWeight: 700 }} size="small" />
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">Member Since</Typography>
                    <Typography sx={{ color: '#e63946', fontWeight: 700 }}>
                      {profile?.date_joined ?
                        new Date(profile.date_joined).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) :
                        'N/A'
                      }
                    </Typography>
                  </Box>
                  {profile?.profile && (
                    <>
                      <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary">Verification Status</Typography>
                        {getVerificationStatusBadge(profile.profile.verification_status)}
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary">Credits Available</Typography>
                        <Typography variant="h6" sx={{ color: '#e63946', fontWeight: 700 }}>{profile.profile.credits}</Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary">Account Status</Typography>
                        <Chip
                          label={profile.profile.is_account_active ? "Active" : "Inactive"}
                          sx={{
                            background: profile.profile.is_account_active ? '#2ecc71' : '#f4a261',
                            color: '#fff',
                            fontWeight: 700
                          }}
                          size="small"
                        />
                      </Box>
                      {profile.profile.verified_at && (
                        <Box textAlign="center">
                          <Typography variant="caption" color="text.secondary">Verified On</Typography>
                          <Typography sx={{ color: '#e63946', fontWeight: 700 }}>
                            {new Date(profile.profile.verified_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Verification Information */}
            {profile?.profile && (
              <Card sx={{ mt: 3, borderTop: '4px solid #e63946', borderRadius: 0 }}>
                <CardHeader
                  avatar={<ShieldIcon sx={{ color: '#e63946' }} />}
                  title={
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#e63946', textAlign: 'center' }}>
                      Verification Details
                    </Typography>
                  }
                  sx={{ pb: 0, textAlign: 'center' }}
                />
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary">Aadhar Number</Typography>
                      <Typography sx={{ color: '#e63946', fontWeight: 700 }}>
                        ****-****-{profile.profile.aadhar_number?.slice(-4)}
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary">PAN Number</Typography>
                      <Typography sx={{ color: '#e63946', fontWeight: 700 }}>
                        {profile.profile.pan_number?.slice(0, 4)}******
                      </Typography>
                    </Box>
                    {profile.profile.verification_status === 'pending' && (
                      <Alert
                        type="info"
                        message={
                          <span>
                            <HourglassEmptyIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#e63946' }} />
                            Your documents are under review. You'll be notified once verification is complete.
                          </span>
                        }
                        sx={{ mt: 2, mb: 0, textAlign: 'center' }}
                      />
                    )}
                    {profile.profile.verification_status === 'rejected' && (
                      <Alert
                        type="warning"
                        message={
                          <span>
                            <WarningAmberIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#e63946' }} />
                            Verification was rejected. Please contact support for assistance.
                          </span>
                        }
                        sx={{ mt: 2, mb: 0, textAlign: 'center' }}
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProfileManagement;
