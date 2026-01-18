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

  if (loading && !blog) return <div>Loading...</div>;

  if (!blog) return <div>Blog not found</div>;

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
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>{blog.url}</p>
      <div className="likes">
        <p className="likes-count">{blog.likes} likes</p>
        <button onClick={handleLike}>like</button>
      </div>
      <p>
        Added by <Link to={`/users/${blog.user.id}`}>{blog.user.name}</Link>
      </p>
      {currentUser?.username === blog.user.username && (
        <button onClick={handleDelete}>remove</button>
      )}

      <h3>Comments</h3>

      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="write a comment..."
        />
        <button type="submit">Add Comment</button>
      </form>

      {blog.comments && blog.comments.length > 0 ? (
        <ul>
          {blog.comments.map((c, index) => (
            <li key={index}>{c}</li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  );
};

export default BlogDetails;
