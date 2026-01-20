import { Box, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import BlogDetails from './components/BlogDetails';
import BlogsList from './components/BlogsList';
import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import User from './components/User';
import UsersList from './components/UsersList';
import blogService from './services/blogs';

const App = () => {
  const user = useSelector(({ user }) => user);
  const notification = useSelector(({ notification }) => notification);
  const { message, status } = notification;

  if (user) blogService.setToken(user.token);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Navigation />

      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } }}
      >
        <Notification message={message} status={status} />

        <Routes>
          <Route path="/" element={<BlogsList />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
