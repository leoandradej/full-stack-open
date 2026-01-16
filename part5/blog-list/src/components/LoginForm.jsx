import { useDispatch } from 'react-redux';
import { showNotification } from '../reducers/notificationReducer';
import { appendUser } from '../reducers/userReducer';

const LoginForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const username = e.target.username.value;
      const password = e.target.password.value;
      e.target.username.value = '';
      e.target.password.value = '';

      await dispatch(appendUser({ username, password }));
      dispatch(showNotification(`${username} logged in`, 'success', 5));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        dispatch(
          showNotification(
            error.response.data.error || 'wrong username or password',
            'error',
            5
          )
        );
      } else {
        dispatch(showNotification('Wrong username or password', 'error', 5));
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          username:
          <input type="text" name="username" />
        </label>
        <label>
          password:
          <input type="password" name="password" />
        </label>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
