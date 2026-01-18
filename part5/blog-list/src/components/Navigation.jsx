import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteUser } from '../reducers/userReducer';

const Navigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);

  return (
    <nav>
      <Link to="/">Blogs</Link>
      {user ? (
        <>
          <Link to="/users">Users</Link>
          <span>{user.name} logged in</span>
          <button onClick={() => dispatch(deleteUser())}>logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navigation;
