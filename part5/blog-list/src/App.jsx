import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogForm from './components/BlogForm';
import BlogsList from './components/BlogsList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Toggable from './components/Togglable';
import { fetchBlogs } from './reducers/blogReducer';
import blogService from './services/blogs';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const notification = useSelector(({ notification }) => notification);
  const { message, status } = notification;

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (user) blogService.setToken(user.token);

  return (
    <div className="wrapper">
      {!user ? (
        <>
          <Notification message={message} className={status} />
          <Toggable buttonLabel="login">
            <LoginForm />
          </Toggable>
        </>
      ) : (
        <>
          <Notification message={message} className={status} />
          <BlogsList />
          <Toggable buttonLabel="create a new blog">
            <BlogForm />
          </Toggable>
        </>
      )}
    </div>
  );
};

export default App;
