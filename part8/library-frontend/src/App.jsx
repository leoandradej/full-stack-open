import { useApolloClient } from '@apollo/client/react';
import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Authors from './components/Authors';
import Books from './components/Books';
import LoginForm from './components/LoginForm';
import NewBook from './components/NewBook';
import Notify from './components/Notify';

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('library-user-token')
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const client = useApolloClient();
  console.log(client);

  const onLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  return (
    <div>
      <div>
        <button>
          <Link to="/">authors</Link>
        </button>
        <button>
          <Link to="/books">books</Link>
        </button>
        {!token ? (
          <button>
            <Link to="/login">login</Link>
          </button>
        ) : (
          <>
            <button>
              <Link to="/new-book">add book</Link>
            </button>
            <button>
              <Link to="/recommended">recommended</Link>
            </button>
            <button onClick={onLogout}>logout</button>
          </>
        )}
      </div>
      <Notify errorMessage={errorMessage} />

      <Routes>
        <Route path="/" element={<Authors setError={notify} />} />
        <Route path="/books" element={<Books setError={notify} />} />
        <Route path="/new-book" element={<NewBook setError={notify} />} />
        <Route
          path="/login"
          element={<LoginForm setToken={setToken} setError={notify} />}
        />
        <Route path="/recommended" element={<Books setError={notify} />} />
      </Routes>
    </div>
  );
};

export default App;
