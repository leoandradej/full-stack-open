import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const EditAuthorForm = ({ authors, setError }) => {
  const [name, setName] = useState(authors[0].name);
  const [birthYear, setBirthYear] = useState('');

  const [changeBirthYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onCompleted: (data) => {
      if (!data.editAuthor) {
        setError('Author not found');
      }
    },
    onError: (error) => setError(error.message),
  });

  const submit = (e) => {
    e.preventDefault();

    if (birthYear < 1000 || birthYear > 9999) {
      setError('Birth year must be a four-digit year (e.g., 1952)');
      return;
    }

    changeBirthYear({ variables: { name, setBornTo: birthYear } });

    setName(authors[0].name);
    setBirthYear('');
  };
  return (
    <div>
      <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          name{' '}
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born{' '}
          <input
            value={birthYear}
            type="number"
            onChange={({ target }) => setBirthYear(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default EditAuthorForm;
