import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { deleteUser } from '../reducers/userReducer';

const Navigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(deleteUser());
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Blogs' },
    ...(user ? [{ path: '/users', label: 'Users' }] : []),
  ];

  const DesktopNav = () => (
    <Box
      sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}
    >
      {navLinks.map(({ path, label }) => (
        <Button
          key={path}
          component={Link}
          to={path}
          color="inherit"
          sx={{
            fontWeight: isActive(path) ? 600 : 400,
            borderBottom: isActive(path) ? '2px solid' : 'none',
            borderRadius: 0,
            px: 2,
          }}
        >
          {label}
        </Button>
      ))}

      {user ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
          <Typography variant="body2" sx={{ color: 'success.light' }}>
            {user.name}
          </Typography>
          <IconButton
            onClick={handleLogout}
            color="inherit"
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      ) : (
        <Button
          component={Link}
          to="/login"
          color="inherit"
          variant="outlined"
          sx={{ ml: 2 }}
        >
          Login
        </Button>
      )}
    </Box>
  );

  const MobileNav = () => (
    <>
      <IconButton
        color="inherit"
        edge="end"
        onClick={() => setMobileMenuOpen(true)}
        sx={{ display: { md: 'none' } }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          {user && (
            <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Signed in as
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {user.name}
              </Typography>
            </Box>
          )}
          <List>
            {navLinks.map(({ path, label }) => (
              <ListItem key={path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  selected={isActive(path)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}

            {user ? (
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );

  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            BlogList
          </Typography>

          {isMobile ? <MobileNav /> : <DesktopNav />}
        </Toolbar>
      </Container>
    </AppBar>
    // <nav>
    //   <Link to="/">Blogs</Link>
    //   {user ? (
    //     <>
    //       <Link to="/users">Users</Link>
    //       <span>{user.name} logged in</span>
    //       <IconButton onClick={() => dispatch(deleteUser())}>
    //         <LogoutIcon color="hsl(175, 61%, 7%)" />
    //       </IconButton>
    //     </>
    //   ) : (
    //     <Link to="/login">Login</Link>
    //   )}
    // </nav>
  );
};

export default Navigation;
