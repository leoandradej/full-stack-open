import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../reducers/blogReducer';
import Blog from './Blog';
import BlogForm from './BlogForm';
import Togglable from './Togglable';

const BlogsList = () => {
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const blogs = useSelector(({ blogs }) => blogs.items);
  const loading = useSelector(({ blogs }) => blogs.loading);
  const error = useSelector(({ blogs }) => blogs.error);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading && blogs.length === 0) return <div>Loading blogs...</div>;

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => dispatch(fetchBlogs())}>Retry</button>
      </div>
    );
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <>
      <div className="blogs">
        <h2>blogs</h2>
        <Togglable buttonLabel="Create New">
          <BlogForm />
        </Togglable>
        {loading && <p>Updating...</p>}
        {sortedBlogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </>
  );
};

export default BlogsList;
