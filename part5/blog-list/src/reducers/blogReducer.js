import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => action.payload,
    createBlog: (state, action) => {
      state.push(action.payload);
    },
    updateBlogInState: (state, action) => {
      return state.map((blog) =>
        blog.id !== action.payload.id ? blog : action.payload
      );
    },
    removeBlog: (state, action) => {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

export const { setBlogs, createBlog, updateBlogInState, removeBlog } =
  blogSlice.actions;

export const fetchBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll();
      dispatch(setBlogs(blogs));
    } catch (error) {
      console.error('Error fetching blogs', error);
    }
  };
};

export const appendBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.createBlog(blogObject);
    dispatch(createBlog(newBlog));
    return newBlog;
  };
};

export const updateBlog = (id, blogObject) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.updateBlog(id, blogObject);
    dispatch(updateBlogInState(updatedBlog));
    return updatedBlog;
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id);
    dispatch(removeBlog(id));
  };
};

export default blogSlice.reducer;
