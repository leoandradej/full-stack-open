import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LinkIcon from '@mui/icons-material/Link';
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  addComment,
  deleteBlog,
  fetchBlogs,
  updateBlog,
} from '../reducers/blogReducer';
import { showNotification } from '../reducers/notificationReducer';

const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');

  const blog = useSelector(({ blogs }) => blogs.items.find((b) => b.id === id));
  const currentUser = useSelector(({ user }) => user);
  const loading = useSelector(({ blogs }) => blogs.loading);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading && !blog) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Blog not found
        </Typography>
        <Button component={Link} to="/" sx={{ mt: 2 }}>
          Back to Blogs
        </Button>
      </Box>
    );
  }

  const handleLike = async () => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      };

      await dispatch(updateBlog(blog.id, updatedBlog));
    } catch (error) {
      console.error('Failed to update blog', error);
      dispatch(showNotification('Failed to update blog', 'error', 5));
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await dispatch(deleteBlog(blog.id));
        navigate('/');
        dispatch(showNotification(`'${blog.title}' was deleted`, 'success', 5));
      } catch (error) {
        console.error('Failed to delete blog', error);
        dispatch(showNotification('Failed to delete blog', 'error', 5));
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await dispatch(addComment(blog.id, comment));
      setComment('');
      dispatch(showNotification('Comment added', 'success', 5));
    } catch (error) {
      console.error('Failed to add comment', error);
      dispatch(showNotification('Failed to add comment', 'error', 5));
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            {blog.title}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            by {blog.author}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LinkIcon color="action" fontSize="small" />
            <Typography
              component="a"
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {blog.url}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip
              icon={<FavoriteIcon />}
              label={`${blog.likes} likes`}
              color="primary"
              variant="outlined"
            />
            <Button
              variant="contained"
              startIcon={<FavoriteIcon />}
              onClick={handleLike}
              size="small"
            >
              Like
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Added by{' '}
            <Link
              to={`/users/${blog.user.id}`}
              style={{ color: 'inherit', fontWeight: 600 }}
            >
              {blog.user.name}
            </Link>
          </Typography>

          {currentUser?.username === blog.user.username && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ mt: 2 }}
            >
              Remove Blog
            </Button>
          )}
        </CardContent>
      </Card>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Comments
        </Typography>

        <Box
          component="form"
          onSubmit={handleAddComment}
          sx={{ display: 'flex', gap: 1, mb: 3 }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!comment.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {blog.comments && blog.comments.length > 0 ? (
          <List>
            {blog.comments.map((c, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: index % 2 === 0 ? 'action.hover' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemText
                  primary={c}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No comments yet. Be the first to comment!
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default BlogDetails;
