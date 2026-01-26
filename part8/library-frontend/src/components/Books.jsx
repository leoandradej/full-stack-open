import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ALL_BOOKS, ALL_BOOKS_BY_GENRE, USER } from '../queries';

const Books = ({ setError }) => {
  const [genre, setGenre] = useState(null);

  const location = useLocation();
  const currentPath = location.pathname;

  const {
    loading: userLoading,
    data: userData,
    error: userError,
  } = useQuery(USER, {
    skip: currentPath !== '/recommended',
  });

  const {
    loading: booksLoading,
    data: booksData,
    error: booksError,
  } = useQuery(ALL_BOOKS);

  const {
    loading: booksByGenreLoading,
    data: booksByGenreData,
    error: booksByGenreError,
  } = useQuery(ALL_BOOKS_BY_GENRE, { variables: { genre }, skip: !genre });

  useEffect(() => {
    if (currentPath === '/recommended' && userData?.me?.favoriteGenre) {
      setGenre(userData.me.favoriteGenre);
    } else if (currentPath === '/books') {
      setGenre(null);
    }
  }, [currentPath, userData]);

  useEffect(() => {
    if (userError) setError(userError.message);
    if (booksError) setError(booksError.message);
    if (booksByGenreError) setError(booksByGenreError.message);
  }, [userError, booksError, booksByGenreError, setError]);

  if (userLoading || booksLoading || booksByGenreLoading)
    return <div>Loading...</div>;

  const genres = [
    ...new Set(booksData.allBooks.flatMap((book) => book.genres)),
  ];

  const books = !genre ? booksData.allBooks : booksByGenreData?.allBooks || [];

  return (
    <div>
      <h2>{currentPath === '/recommended' ? 'Recommended' : 'Books'}</h2>

      {genre && (
        <div>
          {currentPath === '/recommended' ? (
            <>
              Books in your favorite genre: <strong>{genre}</strong>
            </>
          ) : (
            <>
              In genre: <strong>{genre}</strong>
            </>
          )}
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {currentPath !== '/recommended' && (
        <div>
          {genres.map((g, index) => (
            <button
              key={index}
              value={g}
              onClick={({ target }) => setGenre(target.value)}
            >
              {g}
            </button>
          ))}
          <button onClick={() => setGenre(null)}>all genres</button>
        </div>
      )}
    </div>
  );
};

export default Books;
