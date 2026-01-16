import { useDispatch } from 'react-redux';
import { appendBlog } from '../reducers/blogReducer';
import { showNotification } from '../reducers/notificationReducer';

const BlogForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const title = e.target.title.value;
      const author = e.target.author.value;
      const url = e.target.url.value;

      await dispatch(appendBlog({ title, author, url, likes: 0 }));

      e.target.title.value = '';
      e.target.author.value = '';
      e.target.url.value = '';

      dispatch(
        showNotification(
          `New blog: '${title}' by ${author} added`,
          'success',
          5
        )
      );
    } catch (error) {
      if (error.response && error.response.status === 400) {
        dispatch(
          showNotification(
            error.response.data.error || 'Error adding blog',
            'error',
            5
          )
        );
      } else {
        dispatch(showNotification('Error adding blog', 'error', 5));
      }
    }
  };

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={handleSubmit} className="blog-form">
        <label>
          title:
          <input type="text" name="title" placeholder="write title here" />
        </label>
        <label>
          author:
          <input type="text" name="author" placeholder="write author here" />
        </label>
        <label>
          url:
          <input type="text" name="url" placeholder="write url here" />
        </label>

        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
