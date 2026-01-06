import Togglable from './Togglable';

const Blog = ({ user, blog, updateBlog, deleteBlog }) => {
  const handleUpdate = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
    });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${blog.title}" by ${blog.author}?`
      )
    ) {
      deleteBlog(blog.id);
    }
  };

  return (
    <div className="blog">
      <p>
        {blog.title} {blog.author}
      </p>
      <Togglable buttonLabel="view">
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
