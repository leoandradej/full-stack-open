import { useEffect, useState } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null;
  });
  const [message, setMessage] = useState(null);
  const [messageStatus, setMessageStatus] = useState('');

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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user));

      blogService.setToken(user.token);

      setUser(user);
      setUsername('');
      setPassword('');
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

  return (
    <div>
      {!user ? (
        <>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
          <Notification message={message} className={messageStatus} />
        </>
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>

          <h2>blogs</h2>
          <Notification message={message} className={messageStatus} />
          {blogs
            .filter((blog) => blog.user?.name === user.name)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}

          <BlogForm
            setBlogs={setBlogs}
            setMessage={setMessage}
            setMessageStatus={setMessageStatus}
          />
        </div>
      )}
    </div>
  );
};

export default App;
