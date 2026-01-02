import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    createBlog({
      title: title,
      author: author,
      url: url,
      likes: 0,
    });

    setTitle('');
    setAuthor('');
    setUrl('');
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
            placeholder="write title here"
          />
        </label>
        <label>
          author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="write author here"
          />
        </label>
        <label>
          url:
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="write url here"
          />
        </label>

        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
