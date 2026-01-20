import ArticleIcon from '@mui/icons-material/Article';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchUsers } from '../reducers/usersReducer';

const User = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const user = useSelector(({ users }) => users.items.find((u) => u.id === id));
  const loading = useSelector(({ users }) => users.loading);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          User not found
        </Typography>
        <Button component={Link} to="/users" sx={{ mt: 2 }}>
          Back to Users
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        {user.name}
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography>Added Blogs ({user.blogs?.length || 0})</Typography>

          {user.blogs && user.blogs.length > 0 ? (
            <List>
              {user.blogs.map((blog) => (
                <ListItem
                  key={blog.id}
                  component={Link}
                  to={`/blogs/${blog.id}`}
                  sx={{
                    textDecoration: 'none',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <ListItemIcon>
                    <ArticleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography color="primary.main" fontWeight={500}>
                        {blog.title}
                      </Typography>
                    }
                    secondary={`by ${blog.author}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 4, textAlign: 'center' }}
            >
              No blogs added yet
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default User;
