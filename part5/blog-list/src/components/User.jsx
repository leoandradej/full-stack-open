import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchUsers } from '../reducers/usersReducer';

const User = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const user = useSelector(({ users }) => users.items.find((u) => u.id === id));
  const loading = useSelector(({ users }) => users.loading);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      {user.blogs && user.blogs.length > 0 ? (
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> by{' '}
              {blog.author}
            </li>
          ))}
        </ul>
      ) : (
        <p>No blogs added yet</p>
      )}
    </div>
  );
};

export default User;
