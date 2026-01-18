import { useDispatch, useSelector } from 'react-redux';
import { appendBlog } from '../reducers/blogReducer';
import { showNotification } from '../reducers/notificationReducer';

const BlogForm = () => {
  const dispatch = useDispatch();
  const loading = useSelector(({ blogs }) => blogs.loading);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const title = e.target.title.value;
      const author = e.target.author.value;
      const url = e.target.url.value;

      await dispatch(appendBlog({ title, author, url, likes: 0 }));

      e.target.reset();

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
    <div>
      <h2>create new blog</h2>
      <form onSubmit={handleSubmit} className="blog-form">
        <label>
          title:
          <input
            type="text"
            name="title"
            placeholder="write title here"
            required
          />
        </label>
        <label>
          author:
          <input
            type="text"
            name="author"
            placeholder="write author here"
            required
          />
        </label>
        <label>
          url:
          <input type="text" name="url" placeholder="write url here" required />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'create'}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
