import { useDispatch, useSelector } from 'react-redux';
import { deleteUser } from '../reducers/userReducer';
import Blog from './Blog';

const BlogsList = () => {
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const blogs = useSelector(({ blogs }) => blogs);
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <>
      <div className="header">
        <p>{user.name} logged in</p>
        <button onClick={() => dispatch(deleteUser())}>logout</button>
      </div>

      <div className="blogs">
        <h2>blogs</h2>
        {sortedBlogs.map((blog) => (
          <Blog key={blog.id} user={user} blog={blog} />
        ))}
      </div>
    </>
  );
};

export default BlogsList;
