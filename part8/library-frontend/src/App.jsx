import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notify from './components/Notify';

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);

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
        <button>
          <Link to="/new-book">add book</Link>
        </button>
      </div>
      <Notify errorMessage={errorMessage} />

      <Routes>
        <Route path="/" element={<Authors setError={setErrorMessage} />} />
        <Route path="/books" element={<Books />} />
        <Route path="/new-book" element={<NewBook setError={notify} />} />
      </Routes>
    </div>
  );
};

export default App;
