import { useEffect, useRef, useState } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Toggable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null;
  });
  const [message, setMessage] = useState(null);
  const [messageStatus, setMessageStatus] = useState('');

  const blogFormRef = useRef();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      } catch (error) {
        console.error('Error fetching blogs', error);
      }
    };

    fetchBlogs();
  }, []);

  if (user) blogService.setToken(user.token);

  const login = async (credentials) => {
    try {
      const user = await loginService.login(credentials);

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user));

      blogService.setToken(user.token);

      setUser(user);
    } catch (error) {
      setMessageStatus('error');
      if (error.response && error.response.status === 401) {
        setMessage(error.response.data.error || 'wrong username or password');
      } else {
        setMessage('wrong username or password');
      }
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser');
    setUser(null);
  };

  const addBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.createBlog(newBlog);
      setBlogs((prevBlogs) => prevBlogs.concat(returnedBlog));

      setMessageStatus('success');
      setMessage(
        `a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`
      );
      setTimeout(() => {
        setMessage(null);
      }, 5000);
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

  const updateBlog = async (updatedBlog) => {
    try {
      const returnedBlog = await blogService.updateBlog(
        updatedBlog.id,
        updatedBlog
      );
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === returnedBlog.id ? returnedBlog : blog
        )
      );

      // setMessageStatus('success');
      // setMessage('blog updated successfully');
      // setTimeout(() => {
      //   setMessage(null);
      // }, 5000);
    } catch (error) {
      setMessageStatus('error');
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.error || 'Error updating blog');
      } else {
        setMessage('Error updating blog');
      }
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.deleteBlog(id);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));

      setMessageStatus('success');
      setMessage('blog was deleted');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      setMessageStatus('error');
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.error || 'Error deleting blog');
      } else {
        setMessage('Error deleting blog');
      }
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      {!user ? (
        <>
          <Notification message={message} className={messageStatus} />
          <Toggable buttonLabel="login">
            <LoginForm login={login} />
          </Toggable>
        </>
      ) : (
        <div className="wrapper">
          <div className="header">
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>logout</button>
          </div>

          <div className="blogs">
            <h2>blogs</h2>
            <Notification message={message} className={messageStatus} />
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  user={user}
                  blog={blog}
                  updateBlog={updateBlog}
                  deleteBlog={deleteBlog}
                />
              ))}
          </div>

          <Toggable buttonLabel="create a new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Toggable>
        </div>
      )}
    </div>
  );
};

export default App;
