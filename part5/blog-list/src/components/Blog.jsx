import { useDispatch } from 'react-redux';
import { deleteBlog, updateBlog } from '../reducers/blogReducer';
import { showNotification } from '../reducers/notificationReducer';
import Togglable from './Togglable';

const Blog = ({ user, blog }) => {
  const dispatch = useDispatch();

  const handleUpdate = async () => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      };

      await dispatch(updateBlog(updatedBlog.id, updatedBlog));
    } catch (error) {
      console.error('Failed to update blog', error);

      if (error.response && error.response.status === 400) {
        dispatch(
          showNotification(
            error.response.data.error || 'Error updating blog',
            'error',
            5
          )
        );
      } else {
        dispatch(showNotification('Error updating blog', 'error', 5));
      }
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteBlog(blog.id));
      dispatch(showNotification(`'${blog.title}' was deleted`, 'success', 5));
    } catch (error) {
      console.error('Failed to delete blog', error);

      if (error.response && error.response.status === 400) {
        dispatch(
          showNotification(
            error.response.data.error || 'Error deleting blog',
            'error',
            5
          )
        );
      } else {
        dispatch(showNotification('Error deleting blog', 'error', 5));
      }
    }
  };

  return (
    <div className="blog">
      <p>
        {blog.title} {blog.author}
      </p>
      <Togglable buttonLabel="view" cancelLabel="hide">
        <p>{blog.url}</p>
        <div className="likes">
          <p className="likes-count">likes {blog.likes}</p>
          <button onClick={handleUpdate}>like</button>
        </div>
        <p>{blog.user.name}</p>
        {user.name === blog.user.name && (
          <button onClick={handleDelete}>remove</button>
        )}
      </Togglable>
    </div>
  );
};

export default Blog;
