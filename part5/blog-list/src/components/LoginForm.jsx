const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          username:
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <label>
          password:
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
