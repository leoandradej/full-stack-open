import { useDispatch, useSelector } from 'react-redux';
import { incrementVote } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  );
};

const AnecdotesList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === '') return anecdotes;

    return anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  const vote = (id) => {
    const anecdote = anecdotes.find((a) => a.id === id);
    dispatch(incrementVote(id));
    dispatch(showNotification(`You voted '${anecdote.content}'`, 5));
  };

  return (
    <>
      {sortedAnecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote.id)}
        />
      ))}
    </>
  );
};

export default AnecdotesList;
