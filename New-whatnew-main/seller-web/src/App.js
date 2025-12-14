import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/auth';
import { ThemeProvider, CssBaseline, Button } from '@mui/material';
import theme from './theme';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import LivestreamList from './pages/Livestreams/LivestreamList';
import LivestreamForm from './pages/Livestreams/LivestreamForm';
import LivestreamEdit from './pages/Livestreams/LivestreamEdit';
import LivestreamControlPanel from './pages/Livestreams/LivestreamControlPanel';
import LivestreamAnalytics from './pages/Livestreams/LivestreamAnalytics';
import LivestreamDetails from './pages/Livestreams/LivestreamDetails';
import OrdersManagement from './pages/Orders/OrdersManagement';
import PaymentsManagement from './pages/Payments/PaymentsManagement';
import CreditsManagement from './pages/Credits/CreditsManagement';
import ProfileManagement from './pages/Profile/ProfileManagement';

// Common Components
import LoadingSpinner from './components/Common/LoadingSpinner';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        // Always fetch fresh user data from the backend
        const profileData = await authService.getProfile();
        setUser(profileData);
        localStorage.setItem('user', JSON.stringify(profileData));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid auth data
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        const profileData = await authService.getProfile();
        setUser(profileData);
        localStorage.setItem('user', JSON.stringify(profileData));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    // Check if seller account is required
    if (user.user_type !== 'seller') {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  // Public Route Component (redirect if authenticated)
  const PublicRoute = ({ children }) => {
    if (user && user.user_type === 'seller') {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <LoadingSpinner text="Loading application..." />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          {user && <Navbar user={user} onLogout={handleLogout} />}
          
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login onLogin={handleLogin} />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard user={user} refreshUser={refreshUser} />
                  </ProtectedRoute>
                } 
              />
              
              {/* Product Routes */}
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/products/create" 
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/products/:id/edit" 
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                } 
              />
              
              {/* Livestream Routes */}
              <Route 
                path="/livestreams" 
                element={
                  <ProtectedRoute>
                    <LivestreamList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/livestreams/create" 
                element={
                  <ProtectedRoute>
                    <LivestreamForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/livestreams/:id/edit" 
                element={
                  <ProtectedRoute>
                    <LivestreamEdit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/livestreams/:id/analytics" 
                element={
                  <ProtectedRoute>
                    <LivestreamAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/livestreams/:id/details" 
                element={
                  <ProtectedRoute>
                    <LivestreamDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/livestreams/:livestreamId/control" 
                element={
                  <ProtectedRoute>
                    <LivestreamControlPanel />
                  </ProtectedRoute>
                } 
              />
              
              {/* Order Management */}
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <OrdersManagement />
                  </ProtectedRoute>
                } 
              />
              
              {/* Payments & Withdrawals */}
              <Route 
                path="/payments" 
                element={
                  <ProtectedRoute>
                    <PaymentsManagement />
                  </ProtectedRoute>
                } 
              />
              
              {/* Credits Management */}
              <Route 
                path="/credits" 
                element={
                  <ProtectedRoute>
                    <CreditsManagement refreshUser={refreshUser} />
                  </ProtectedRoute>
                } 
              />
              
              {/* Profile Management */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfileManagement refreshUser={refreshUser} />
                  </ProtectedRoute>
                } 
              />

              {/* Redirect root to appropriate page */}
              <Route 
                path="/" 
                element={
                  user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                } 
              />

              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="container-fluid py-4">
                    <div className="text-center">
                      <h1>404 - Page Not Found</h1>
                      <p>The page you're looking for doesn't exist.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => window.history.back()}
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </main>
          
          {user && <Footer />}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
