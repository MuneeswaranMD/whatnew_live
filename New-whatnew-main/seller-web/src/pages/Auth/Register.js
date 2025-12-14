import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { useForm, validationRules, ErrorText } from '../../hooks/useForm';
import Alert from '../../components/Common/Alert';
import { Box, Paper, Typography, TextField, Button, Stack, Stepper, Step, StepLabel, InputAdornment, Avatar, Grid } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessIcon from '@mui/icons-material/Storefront';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Lottie from 'lottie-react';
import axonAnimation from '../../assets/animations/axon.json';

const steps = ['Account Info', 'Business Details'];

const Register = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [step, setStep] = useState(0);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useForm(
    {
      username: '',
      email: '',
      password: '',
      password_confirm: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      shop_name: '',
      shop_address: '',
      aadhar_number: '',
      pan_number: ''
    },
    {
      username: [validationRules.required, validationRules.minLength(3)],
      email: [validationRules.required, validationRules.email],
      password: [validationRules.required, validationRules.minLength(8)],
      password_confirm: [
        validationRules.required,
        (value, allValues) => {
          if (value !== allValues.password) {
            return 'Passwords do not match';
          }
          return '';
        }
      ],
      first_name: [validationRules.required],
      last_name: [validationRules.required],
      phone_number: [validationRules.required, validationRules.phone],
      shop_name: [validationRules.required],
      shop_address: [validationRules.required],
      aadhar_number: [validationRules.required, validationRules.aadhar],
      pan_number: [validationRules.required, validationRules.pan]
    }
  );

  const onSubmit = async (formData) => {
    try {
      const response = await authService.registerSeller(formData);
      setAlert({
        type: 'success',
        message: 'Registration successful! You can now login. Your account will be reviewed and verified within 3-5 business days.'
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.error || 'Registration failed. Please try again.'
      });
    }
  };

  const nextStep = () => {
    // Validate current step fields
    const step1Fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name'];
    const step2Fields = ['phone_number', 'shop_name', 'shop_address', 'aadhar_number', 'pan_number'];
    const fields = step === 0 ? step1Fields : step2Fields;
    const hasErrors = fields.some(field => {
      const rules = validationRules[field] || [];
      return rules.some(rule => rule(values[field], values));
    });
    if (!hasErrors) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f7f7fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 540,
          width: '100%',
          mx: 2,
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(230,57,70,0.10)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ width: 90, mb: 1 }}>
            <Lottie animationData={axonAnimation} loop={true} />
          </Box>
          <Avatar sx={{ bgcolor: '#e63946', width: 56, height: 56, mb: 1 }}>
            <PersonAddIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight={900} color="#e63946" gutterBottom>
            Seller Registration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Create your seller account
          </Typography>
        </Box>

        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          <Step>
            <StepLabel icon={<PersonAddIcon />}>Account Info</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<BusinessIcon />}>Business Details</StepLabel>
          </Step>
        </Stepper>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            sx={{ mb: 3, textAlign: 'center' }}
          />
        )}

        <form
          onSubmit={e => {
            e.preventDefault();
            if (step === 1) handleSubmit(onSubmit);
          }}
          autoComplete="off"
        >
          {step === 0 && (
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    value={values.first_name}
                    onChange={e => handleChange('first_name', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.first_name}
                  />
                  {errors.first_name && <ErrorText>{errors.first_name}</ErrorText>}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    value={values.last_name}
                    onChange={e => handleChange('last_name', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.last_name}
                  />
                  {errors.last_name && <ErrorText>{errors.last_name}</ErrorText>}
                </Grid>
              </Grid>
              <TextField
                label="Username"
                value={values.username}
                onChange={e => handleChange('username', e.target.value)}
                fullWidth
                required
                error={!!errors.username}
              />
              {errors.username && <ErrorText>{errors.username}</ErrorText>}
              <TextField
                label="Email"
                type="email"
                value={values.email}
                onChange={e => handleChange('email', e.target.value)}
                fullWidth
                required
                error={!!errors.email}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={e => handleChange('password', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.password}
                  />
                  {errors.password && <ErrorText>{errors.password}</ErrorText>}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={values.password_confirm}
                    onChange={e => handleChange('password_confirm', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.password_confirm}
                  />
                  {errors.password_confirm && <ErrorText>{errors.password_confirm}</ErrorText>}
                </Grid>
              </Grid>
              <Button
                type="button"
                variant="contained"
                fullWidth
                sx={{
                  background: '#e63946',
                  color: '#fff',
                  fontWeight: 700,
                  py: 1.5,
                  mt: 2,
                  borderRadius: 2,
                  '&:hover': { background: '#b71c1c' }
                }}
                onClick={nextStep}
                endIcon={<ArrowForwardIcon />}
              >
                Next: Business Details
              </Button>
            </Stack>
          )}

          {step === 1 && (
            <Stack spacing={2}>
              <TextField
                label="Phone Number"
                value={values.phone_number}
                onChange={e => handleChange('phone_number', e.target.value)}
                fullWidth
                required
                error={!!errors.phone_number}
                helperText="10-digit mobile number"
              />
              {errors.phone_number && <ErrorText>{errors.phone_number}</ErrorText>}
              <TextField
                label="Shop Name"
                value={values.shop_name}
                onChange={e => handleChange('shop_name', e.target.value)}
                fullWidth
                required
                error={!!errors.shop_name}
              />
              {errors.shop_name && <ErrorText>{errors.shop_name}</ErrorText>}
              <TextField
                label="Shop Address"
                value={values.shop_address}
                onChange={e => handleChange('shop_address', e.target.value)}
                fullWidth
                required
                multiline
                minRows={2}
                error={!!errors.shop_address}
              />
              {errors.shop_address && <ErrorText>{errors.shop_address}</ErrorText>}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Aadhar Number"
                    value={values.aadhar_number}
                    onChange={e => handleChange('aadhar_number', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.aadhar_number}
                    inputProps={{ maxLength: 12 }}
                  />
                  {errors.aadhar_number && <ErrorText>{errors.aadhar_number}</ErrorText>}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="PAN Number"
                    value={values.pan_number}
                    onChange={e => handleChange('pan_number', e.target.value.toUpperCase())}
                    fullWidth
                    required
                    error={!!errors.pan_number}
                    inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
                  />
                  {errors.pan_number && <ErrorText>{errors.pan_number}</ErrorText>}
                </Grid>
              </Grid>
              <Box sx={{ bgcolor: '#fff3cd', color: '#856404', p: 2, borderRadius: 2, fontSize: 15, mt: 1 }}>
                <b>Verification Required:</b> Your account will be reviewed and verified within 3-5 business days. You'll receive 1 free credit upon verification.
              </Box>
              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={prevStep}
                  startIcon={<ArrowBackIcon />}
                  sx={{ fontWeight: 700, flex: 1 }}
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: '#e63946',
                    color: '#fff',
                    fontWeight: 700,
                    flex: 1,
                    '&:hover': { background: '#b71c1c' }
                  }}
                  disabled={isSubmitting}
                  endIcon={<CheckCircleIcon />}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </Button>
              </Stack>
            </Stack>
          )}
        </form>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#e63946', fontWeight: 700, textDecoration: 'none' }}>
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
