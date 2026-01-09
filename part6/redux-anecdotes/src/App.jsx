import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AnecdoteForm from './components/AnecdoteForm';
import AnecdotesList from './components/AnecdotesList';
import Filter from './components/Filter';
import Notification from './components/Notification';
import { initializeAnecdotes } from './reducers/anecdoteReducer';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAnecdotes = async () => {
      try {
        dispatch(initializeAnecdotes());
      } catch (error) {
        console.error('Failed to fetch anecdotes', error);
      }
    };

    fetchAnecdotes();
  }, [dispatch]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdotesList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
