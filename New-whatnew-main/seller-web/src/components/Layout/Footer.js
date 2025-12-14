import React from 'react';
import { Box, Typography, Grid, Link, Divider, IconButton, Paper } from '@mui/material';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SecurityIcon from '@mui/icons-material/Security';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShowChartIcon from '@mui/icons-material/ShowChart';
// Add your WhatNew logo SVG or image import here:
import whatnewLogo from '../../assets/logo/logo.svg';

const Footer = () => {
  return (
    <Paper
      component="footer"
      elevation={3}
      sx={{
        bgcolor: 'linear-gradient(90deg, #fff 0%, #f7f7fa 100%)',
        color: '#222',
        py: { xs: 5, md: 7 },
        mt: 'auto',
        borderRadius: 0,
        boxShadow: '0 -4px 32px rgba(69,123,157,0.06)',
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Grid container spacing={4}>
          {/* WhatNew Live Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: '#e63946',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                fontWeight: 900,
                letterSpacing: 1
              }}
            >
              {/* WhatNew Icon */}
              <Box
                component="img"
                src={whatnewLogo}
                alt="WhatNew Logo"
                sx={{
                  width: 66,
                  height: 66,
                  mr: 1,
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}
              />
              WhatNew Live
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#333' }}>
              Empowering sellers with cutting-edge livestream commerce technology. Reach millions of customers through interactive live selling experiences.
            </Typography>
            <Box>
              <IconButton href="#" aria-label="Facebook" sx={{ color: '#4267B2', bgcolor: 'rgba(66,103,178,0.08)', mr: 1, '&:hover': { bgcolor: '#4267B2', color: '#fff' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="#" aria-label="Twitter" sx={{ color: '#1DA1F2', bgcolor: 'rgba(29,161,242,0.08)', mr: 1, '&:hover': { bgcolor: '#1DA1F2', color: '#fff' } }}>
                <TwitterIcon />
              </IconButton>
              <IconButton href="#" aria-label="Instagram" sx={{ color: '#E1306C', bgcolor: 'rgba(225,48,108,0.08)', mr: 1, '&:hover': { bgcolor: '#E1306C', color: '#fff' } }}>
                <InstagramIcon />
              </IconButton>
              <IconButton href="#" aria-label="YouTube" sx={{ color: '#FF0000', bgcolor: 'rgba(255,0,0,0.08)', '&:hover': { bgcolor: '#FF0000', color: '#fff' } }}>
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Platform Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 2, color: '#457b9d', letterSpacing: 1 }}>
              Platform
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {['Dashboard', 'Products', 'Livestreams', 'Orders', 'Analytics'].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1 }}>
                  <Link
                    href="#"
                    underline="none"
                    color="inherit"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 500,
                      opacity: 0.92,
                      '&:hover': { color: '#e63946', pl: 1, opacity: 1 },
                      transition: 'all 0.2s',
                    }}
                  >
                    <ArrowRightIcon fontSize="small" sx={{ mr: 1, color: '#b71c1c' }} />
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Support Links */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="subtitle1" sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 2, color: '#457b9d', letterSpacing: 1 }}>
              Support
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {[
                { label: 'Help Center', icon: <HelpOutlineIcon fontSize="small" sx={{ mr: 1, color: '#457b9d' }} /> },
                { label: 'Live Chat', icon: <ChatIcon fontSize="small" sx={{ mr: 1, color: '#e63946' }} /> },
                { label: 'Contact Us', icon: <EmailIcon fontSize="small" sx={{ mr: 1, color: '#b71c1c' }} /> },
                { label: 'Documentation', icon: <MenuBookIcon fontSize="small" sx={{ mr: 1, color: '#457b9d' }} /> },
                { label: 'Privacy Policy', icon: <SecurityIcon fontSize="small" sx={{ mr: 1, color: '#2ecc71' }} /> },
              ].map(({ label, icon }) => (
                <Box component="li" key={label} sx={{ mb: 1 }}>
                  <Link
                    href="#"
                    underline="none"
                    color="inherit"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 500,
                      opacity: 0.92,
                      '&:hover': { color: '#e63946', pl: 1, opacity: 1 },
                      transition: 'all 0.2s',
                    }}
                  >
                    {icon}
                    {label}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={12} md={3}>
            <Typography variant="subtitle1" sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 2, color: '#457b9d', letterSpacing: 1 }}>
              Contact Info
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', color: '#333' }}>
                <LocationOnIcon sx={{ mr: 1, mt: '4px', color: '#e63946' }} />
                <Box>
                  <strong>Address:</strong><br />
                  123 Commerce Street<br />
                  Business District, Mumbai - 400001
                </Box>
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                <PhoneIcon sx={{ mr: 1, color: '#457b9d' }} />
                <strong>Phone:</strong> +91 98765 43210
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                <EmailIcon sx={{ mr: 1, color: '#e63946' }} />
                <strong>Email:</strong>&nbsp;
                <Link href="mailto:support@whatnewlive.com" underline="hover" color="#e63946" sx={{ fontWeight: 500 }}>
                  support@whatnewlive.com
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ bgcolor: 'rgba(69,123,157,0.10)', my: 4 }} />

        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: '#888', mb: { xs: 2, md: 0 } }}>
              &copy; 2025 WhatNew Live. All rights reserved.&nbsp;
              <Typography component="span" sx={{ color: '#e63946', fontWeight: 700 }}>
                Built with ❤️ for sellers
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="caption" sx={{ color: '#888', display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
              <LockIcon fontSize="small" sx={{ color: '#b71c1c' }} />
              Secure Platform
              <AccessTimeIcon fontSize="small" sx={{ ml: 2, color: '#457b9d' }} />
              24/7 Support
              <ShowChartIcon fontSize="small" sx={{ ml: 2, color: '#2ecc71' }} />
              Real-time Analytics
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Footer;
