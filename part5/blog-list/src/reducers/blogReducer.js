import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state, action) => {
      state.error = null;
    },
    setBlogs: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    createBlog: (state, action) => {
      state.items.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateBlogInState: (state, action) => {
      const index = state.items.findIndex(
        (blog) => blog.id === action.payload.id
      );
      if (index !== -1) state.items[index] = action.payload;

      state.loading = false;
      state.error = null;
    },
    removeBlog: (state, action) => {
      state.items = state.items.filter((blog) => blog.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    addCommentToBlog: (state, action) => {
      const index = state.items.findIndex(
        (blog) => blog.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setBlogs,
  createBlog,
  updateBlogInState,
  removeBlog,
  addCommentToBlog,
} = blogSlice.actions;

export const fetchBlogs = () => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const blogs = await blogService.getAll();
      dispatch(setBlogs(blogs));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.error || 'Failed to fetch blogs')
      );
      console.error('Failed fetching blogs', error);
    }
  };
};

export const appendBlog = (blogObject) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const newBlog = await blogService.createBlog(blogObject);
      dispatch(createBlog(newBlog));
      return newBlog;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.error || 'Failed to create blog')
      );
      throw error;
    }
  };
};

export const updateBlog = (id, blogObject) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const updatedBlog = await blogService.updateBlog(id, blogObject);
      dispatch(updateBlogInState(updatedBlog));
      return updatedBlog;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.error || 'Failed to update blog')
      );
      throw error;
    }
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await blogService.deleteBlog(id);
      dispatch(removeBlog(id));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.error || 'Failed to delete blog')
      );
      throw error;
    }
  };
};

export const addComment = (id, comment) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const updatedBlog = await blogService.addComment(id, comment);
      dispatch(addCommentToBlog(updatedBlog));
      return updatedBlog;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.error || 'Failed to add comment')
      );
      throw error;
    }
  };
};

export default blogSlice.reducer;
