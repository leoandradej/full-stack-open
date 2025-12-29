import { useState } from 'react';
import blogService from '../services/blogs';

const BlogForm = ({ setBlogs, setMessage, setMessageStatus }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
      likes: 0,
    };

    try {
      const returnedBlog = await blogService.createBlog(newBlog);
      setBlogs((prevBlogs) => prevBlogs.concat(returnedBlog));

      setTitle('');
      setAuthor('');
      setUrl('');
      setMessageStatus('success');
      setMessage(
        `a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`
      );
    } catch (error) {
      setMessageStatus('error');
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.error || 'Error adding blog');
      } else {
        setMessage('Error adding blog');
      }
      setTimeout(() => {
        setMessage(null);
      }, 5000);
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
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
        <label>
          author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <label>
          url:
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>

        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
