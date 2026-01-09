const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  const response = await fetch(baseUrl);

  if (!response.ok) throw new Error('Failed to fetch anecdotes');

  return await response.json();
};

const createAnecdote = async (content) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  };

  const response = await fetch(baseUrl, options);

  if (!response.ok) throw new Error('Failed to create new anecdote');

  return await response.json();
};

const incrementVote = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`);

  if (!response.ok) throw new Error('Failed to fetch anecdote');

  const anecdote = await response.json();

  const changedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1,
  };

  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changedAnecdote),
  };

  const updateResponse = await fetch(`${baseUrl}/${id}`, options);

  if (!updateResponse.ok) throw new Error('Failed to update anecdote');

  return await updateResponse.json();
};

export default { getAll, createAnecdote, incrementVote };
