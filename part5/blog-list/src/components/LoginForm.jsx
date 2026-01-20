import LoginIcon from '@mui/icons-material/Login';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../reducers/notificationReducer';
import { appendUser } from '../reducers/userReducer';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(({ user }) => user);
  const loading = useSelector(({ user }) => false);

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const username = e.target.username.value;
      const password = e.target.password.value;

      await dispatch(appendUser({ username, password }));
      navigate('/');
      dispatch(showNotification(`${username} logged in`, 'success', 5));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        dispatch(
          showNotification(
            error.response.data.error || 'wrong username or password',
            'error',
            5
          )
        );
      } else {
        dispatch(showNotification('Wrong username or password', 'error', 5));
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight={700}
          textAlign="center"
        >
          Login
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={3}
        >
          Sign in to your account to continue
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Username"
            name="username"
            autoComplete="username"
            required
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
            disabled={loading}
            fullWidth
            sx={{ mt: 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;
