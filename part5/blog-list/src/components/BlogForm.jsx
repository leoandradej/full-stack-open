import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appendBlog } from '../reducers/blogReducer';
import { showNotification } from '../reducers/notificationReducer';

const BlogForm = () => {
  const dispatch = useDispatch();
  const loading = useSelector(({ blogs }) => blogs.loading);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const title = e.target.title.value;
      const author = e.target.author.value;
      const url = e.target.url.value;

      await dispatch(appendBlog({ title, author, url }));

      e.target.reset();
      handleClose();

      dispatch(
        showNotification(
          `New blog: '${title}' by ${author} added`,
          'success',
          5
        )
      );
    } catch (error) {
      dispatch(showNotification('Failed to create blog', 'error', 5));
    }
  };

  return (
    <>
      {!isMobile ? (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(!open)}
        >
          Create New Blog
        </Button>
      ) : (
        <Fab
          color="primary"
          onClick={() => setOpen(!open)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            Create New Blog
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              pt: 1,
            }}
          >
            <TextField
              label="Title"
              name="title"
              placeholder="Enter blog title"
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="Author"
              name="author"
              placeholder="Enter author name"
              required
              fullWidth
            />

            <TextField
              label="URL"
              name="url"
              type="url"
              placeholder="https://example.com"
              required
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
                fullWidth
              >
                {loading ? 'Creating...' : 'Create Blog'}
              </Button>

              <Button onClick={handleClose} variant="outlined" fullWidth>
                Cancel
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogForm;
