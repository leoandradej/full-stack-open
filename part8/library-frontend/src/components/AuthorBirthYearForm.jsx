import { useMutation, useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const AuthorBirthYearForm = ({ setError }) => {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const result = useQuery(ALL_AUTHORS);

  const authors = result.data.allAuthors;

  const [changeBirthYear] = useMutation(EDIT_AUTHOR, {
    onCompleted: (data) => {
      if (!data.editAuthor) {
        setError('Author not found');
      }
    },
    onError: (error) => setError(error.message),
  });

  const submit = (e) => {
    e.preventDefault();

    changeBirthYear({ variables: { name, setBornTo: birthYear } });

    setName('');
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

export default AuthorBirthYearForm;
