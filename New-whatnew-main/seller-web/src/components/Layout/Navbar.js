import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Avatar, Box, Tooltip, Divider, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory2';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ReceiptIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import logoSvg from '../../assets/logo/logo.svg';
import { authService } from '../../services/auth';

const navigationItems = [
  { path: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
  { path: '/products', icon: <InventoryIcon />, label: 'Products' },
  { path: '/livestreams', icon: <LiveTvIcon />, label: 'Livestreams' },
  { path: '/orders', icon: <ReceiptIcon />, label: 'Orders' },
  { path: '/payments', icon: <AccountBalanceWalletIcon />, label: 'Payments' },
  { path: '/credits', icon: <MonetizationOnIcon />, label: 'Credits' },
];

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Light theme palette
  const lightBg = 'rgba(255, 255, 255, 0.95)';
  const accent = '#e63946';
  const accentDark = '#b71c1c';
  const accentLight = '#faf7f8ff';
  const textMain = '#222';
  const textSecondary = '#457b9d';

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActiveRoute = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <Paper
      elevation={2}
      sx={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderRadius: 0,
        bgcolor: lightBg,
        color: textMain,
        boxShadow: '0 2px 16px rgba(49, 69, 81, 0.06)',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, md: 64 },
          px: { xs: 1, sm: 2, md: 4 },
          flexDirection: { xs: 'row', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand & Mobile Menu Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
          <Box
            component={Link}
            to="/dashboard"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              mr: 1,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 96,
                bgcolor: accentLight,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
                boxShadow: '0 2px 8px rgba(230,57,70,0.06)',
              }}
            >
              <img src={logoSvg} alt=" WhatNew" style={{ width: 84, height: 74 }} />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: accent, lineHeight: 1 ,marginLeft: '  b6px'}}>
                WhatNew
              </Typography>
              <Typography variant="caption" sx={{ color: textSecondary, opacity: 0.8 }}>
                Seller Dashboard
              </Typography>
            </Box>
          </Box>
          {/* Mobile menu icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton size="large" onClick={handleOpenNavMenu} sx={{ color: accent }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                mx: 1,
                px: 2,
                py: 1,
                borderRadius: 3,
                fontWeight: 600,
                color: isActiveRoute(item.path) ? accent : textMain,
                bgcolor: isActiveRoute(item.path) ? accentLight : 'transparent',
                '&:hover': {
                  bgcolor: accentLight,
                  color: accentDark,
                },
                textTransform: 'none',
                transition: 'all 0.18s',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Desktop Credits & User */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
          {user && (
            <Button
              component={Link}
              to="/credits"
              startIcon={<MonetizationOnIcon />}
              sx={{
                bgcolor: accentLight,
                color: accent,
                borderRadius: 8,
                px: 2,
                py: 1,
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(230,57,70,0.06)',
                '&:hover': {
                  bgcolor: accent,
                  color: '#fff',
                },
              }}
            >
              {user.profile?.credits || 0} credits
            </Button>
          )}
          {user && (
            <Tooltip title="Account settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    bgcolor: accent,
                    color: '#fff',
                    width: 40,
                    height: 40,
                  }}
                >
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Mobile Navigation Drawer/Menu */}
        <Menu
          anchorEl={anchorElNav}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          PaperProps={{
            sx: {
              bgcolor: '#fff',
              borderRadius: 3,
              mt: 1,
              color: textMain,
              minWidth: 220,
              px: 1,
              boxShadow: '0 4px 24px rgba(69,123,157,0.10)',
            },
          }}
        >
          {navigationItems.map((item) => (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              selected={isActiveRoute(item.path)}
              onClick={handleCloseNavMenu}
              sx={{
                color: isActiveRoute(item.path) ? accent : textMain,
                bgcolor: isActiveRoute(item.path) ? accentLight : 'transparent',
                '&:hover': { bgcolor: accentLight, color: accentDark },
                px: 2,
                py: 2,
                fontSize: '1.1rem',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.icon}
                <Typography>{item.label}</Typography>
              </Box>
            </MenuItem>
          ))}
          {/* Show credits and user info in mobile menu */}
          {user && (
            <MenuItem
              component={Link}
              to="/credits"
              onClick={handleCloseNavMenu}
              sx={{
                color: accent,
                bgcolor: accentLight,
                px: 2,
                py: 2,
                fontWeight: 700,
                borderRadius: 2,
                mb: 1,
              }}
            >
              <MonetizationOnIcon sx={{ mr: 1 }} />
              {user.profile?.credits || 0} credits
            </MenuItem>
          )}
          {user && (
            <MenuItem
              onClick={handleOpenUserMenu}
              sx={{
                color: accent,
                bgcolor: accentLight,
                px: 2,
                py: 2,
                borderRadius: 2,
              }}
            >
              <PersonIcon sx={{ mr: 1 }} />
              {user.first_name || user.username}
            </MenuItem>
          )}
        </Menu>

        {/* User Menu */}
        {user && (
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            PaperProps={{
              sx: {
                borderRadius: 3,
                minWidth: 220,
                bgcolor: '#fff',
                color: textMain,
                boxShadow: '0 4px 24px rgba(69,123,157,0.10)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: accent }}>
                {user.first_name || user.username}
              </Typography>
              <Typography variant="body2" sx={{ color: textSecondary, opacity: 0.8, wordBreak: 'break-all' }}>
                {user.email}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: user.profile?.verification_status === 'verified' ? accent : '#f9a825',
                    color: '#fff',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 5,
                    fontWeight: 600,
                  }}
                >
                  {user.profile?.verification_status === 'verified' ? 'Verified Seller' : 'Pending Verification'}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu} sx={{ color: textMain }}>
              <PersonIcon sx={{ mr: 1, color: accent }} /> Profile Settings
            </MenuItem>
            <MenuItem component={Link} to="/credits" onClick={handleCloseUserMenu} sx={{ color: textMain }}>
              <MonetizationOnIcon sx={{ mr: 1, color: accent }} /> Manage Credits
            </MenuItem>
            <MenuItem component={Link} to="/payments" onClick={handleCloseUserMenu} sx={{ color: textMain }}>
              <AccountBalanceWalletIcon sx={{ mr: 1, color: accent }} /> Payments & Withdrawals
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleLogout();
                handleCloseUserMenu();
              }}
              sx={{
                color: accent,
                '&:hover': { bgcolor: accent, color: '#fff' },
              }}
            >
              <LogoutIcon sx={{ mr: 1, color: accent }} /> Sign Out
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </Paper>
  );
};

export default Navbar;
