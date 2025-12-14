import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { signInWithGoogle } from '../../services/firebase';
import { useForm, validationRules, ErrorText } from '../../hooks/useForm';
import Alert from '../../components/Common/Alert';
import GoogleRegistrationModal from '../../components/Auth/GoogleRegistrationModal';
import { Box, Paper, Typography, TextField, Button, Stack, InputAdornment, Avatar, Divider } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import GoogleIcon from '@mui/icons-material/Google';
import Lottie from 'lottie-react';
import axonAnimation from '../../assets/animations/axon.json';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleRegistration, setShowGoogleRegistration] = useState(false);
  const [googleUserInfo, setGoogleUserInfo] = useState(null);
  const [googleAccessToken, setGoogleAccessToken] = useState(null);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useForm(
    { username: '', password: '' },
    {
      username: [validationRules.required],
      password: [validationRules.required]
    }
  );

  const onSubmit = async (formData) => {
    try {
      const response = await authService.login(formData);
      if (response.user.user_type !== 'seller') {
        setAlert({
          type: 'danger',
          message: 'This portal is only for sellers. Please register as a seller or use the correct login portal.'
        });
        return;
      }
      const profileData = await authService.getProfile();
      onLogin(profileData);
      navigate('/dashboard');
    } catch (error) {
      let errorMessage = 'Login failed. Please check your credentials.';
      let alertType = 'danger';
      if (error.response?.data?.error) {
        const errorType = error.response.data.error;
        if (errorType === 'account_under_review') {
          errorMessage = error.response.data.message || 'We are reviewing your account details. You will receive an email notification of your account status within 3 to 5 business days.';
          alertType = 'warning';
        } else if (errorType === 'account_rejected') {
          errorMessage = error.response.data.message || 'Your seller account verification was rejected. Please contact support for more information.';
          alertType = 'danger';
        } else if (errorType === 'account_inactive') {
          errorMessage = error.response.data.message || 'Your seller account is inactive. Please contact support.';
          alertType = 'danger';
        } else {
          errorMessage = error.response.data.error;
        }
      } else if (error.response?.data?.non_field_errors) {
        const errorMsg = error.response.data.non_field_errors[0];
        if (errorMsg.includes('Invalid username/email')) {
          errorMessage = 'Invalid username/email or password. Please check your credentials.';
        } else if (errorMsg.includes('Invalid credentials')) {
          errorMessage = 'Invalid username/email or password. Please check your credentials.';
        } else {
          errorMessage = errorMsg;
        }
      } else if (error.response?.status === 403) {
        errorMessage = error.response?.data?.message || 'Your seller account is not yet verified. Please wait for verification or contact support.';
        alertType = 'warning';
      } else if (error.response?.status === 400) {
        if (error.response?.data) {
          const errorData = error.response.data;
          if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData.username) {
            errorMessage = `Username/Email error: ${errorData.username[0]}`;
          } else if (errorData.password) {
            errorMessage = `Password error: ${errorData.password[0]}`;
          } else {
            errorMessage = 'Invalid username/email or password. Please check your credentials.';
          }
        } else {
          errorMessage = 'Invalid username/email or password. Please check your credentials.';
        }
      }
      setAlert({
        type: alertType,
        message: errorMessage
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setAlert(null);
      const googleResult = await signInWithGoogle();
      const response = await authService.googleAuth(googleResult.accessToken);
      if (response.is_new_user) {
        setGoogleUserInfo(response.user_info);
        setGoogleAccessToken(googleResult.accessToken);
        setShowGoogleRegistration(true);
      } else {
        if (response.user.user_type !== 'seller') {
          setAlert({
            type: 'danger',
            message: 'This portal is only for sellers. Please register as a seller first.'
          });
          return;
        }
        const profileData = await authService.getProfile();
        onLogin(profileData);
        navigate('/dashboard');
      }
    } catch (error) {
      let errorMessage = 'Google sign-in failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error.message?.includes('Popup was blocked')) {
        errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Google authentication is not configured on the server. Please contact support.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setAlert({
        type: 'danger',
        message: errorMessage
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleRegistrationSuccess = async (registrationData) => {
    try {
      const profileData = await authService.getProfile();
      onLogin(profileData);
      navigate('/dashboard');
    } catch (error) {
      navigate('/dashboard');
    }
  };

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
          maxWidth: 420,
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
            <LockIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight={900} color="#e63946" gutterBottom>
            Seller Login
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Sign in to your seller dashboard
          </Typography>
        </Box>

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
            handleSubmit(onSubmit);
          }}
          autoComplete="off"
        >
          <Stack spacing={2}>
            <TextField
              label="Username or Email"
              value={values.username}
              onChange={e => handleChange('username', e.target.value)}
              placeholder="Enter your username or email"
              fullWidth
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                )
              }}
              error={!!errors.username}
            />
            {errors.username && <ErrorText>{errors.username}</ErrorText>}

            <TextField
              label="Password"
              type="password"
              value={values.password}
              onChange={e => handleChange('password', e.target.value)}
              placeholder="Enter your password"
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                )
              }}
              error={!!errors.password}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}

            <Button
              type="submit"
              variant="contained"
              size="large"
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
              disabled={isSubmitting}
              startIcon={<LoginIcon />}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Button
          variant="outlined"
          size="large"
          fullWidth
          sx={{
            borderColor: '#e63946',
            color: '#e63946',
            fontWeight: 700,
            py: 1.5,
            borderRadius: 2,
            '&:hover': { background: '#e63946', color: '#fff' }
          }}
          onClick={handleGoogleSignIn}
          disabled={googleLoading || isSubmitting}
          startIcon={<GoogleIcon />}
        >
          {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have a seller account?{' '}
            <Link to="/register" style={{ color: '#e63946', fontWeight: 700, textDecoration: 'none' }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Google Registration Modal */}
      <GoogleRegistrationModal
        show={showGoogleRegistration}
        onHide={() => setShowGoogleRegistration(false)}
        userInfo={googleUserInfo}
        accessToken={googleAccessToken}
        onSuccess={handleGoogleRegistrationSuccess}
      />
    </Box>
  );
};

export default Login;
