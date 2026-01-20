import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../reducers/blogReducer';
import Blog from './Blog';
import BlogForm from './BlogForm';

const BlogsList = () => {
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const blogs = useSelector(({ blogs }) => blogs.items);
  const loading = useSelector(({ blogs }) => blogs.loading);
  const error = useSelector(({ blogs }) => blogs.error);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading && blogs.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error" gutterBottom>
          Error: {error}
        </Typography>
        <Button variant="contained" onClick={() => dispatch(fetchBlogs())}>
          Retry
        </Button>
      </Box>
    );
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Blogs
        </Typography>

        {user && !isMobile && <BlogForm />}
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sortedBlogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </Box>

      {sortedBlogs.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            No blogs yet. Be the first to create one!
          </Typography>
        </Box>
      )}

      {/* Floating Action Button for mobile */}
      {user && isMobile && <BlogForm />}
    </Box>
  );
};

export default BlogsList;
