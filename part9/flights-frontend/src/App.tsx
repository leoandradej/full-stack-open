import axios from 'axios';
import { useEffect, useState } from 'react';
import DiaryEntriesList from './components/DiaryEntriesList';
import NewEntryForm from './components/NewEntryForm';
import diaryService from './services/diaries';
import type { DiaryEntry, NewDiaryEntry } from './types';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      const diaryEntries = await diaryService.getAll();
      setDiaryEntries(diaryEntries);
    };
    void fetchDiaryEntries();
  }, []);

  const submitNewDiaryEntry = async (values: NewDiaryEntry) => {
    setError('');
    try {
      const diaryEntry = await diaryService.createDiaryEntry(values);
      setDiaryEntries(diaryEntries.concat(diaryEntry));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response?.data) {
          const data = e.response.data;

          if (typeof data === 'object' && 'error' in data) {
            setError(`Error: ${data.error}`);
          } else if (typeof data === 'string') {
            const message = e.response.data.replace(
              'Something went wrong. Error: ',
              ''
            );
            console.error(message);
            setError(message);
          } else {
            setError('Invalid error format from server');
          }
        } else {
          setError('No response from server');
        }
      } else {
        console.error('Unknown error', e);
        setError('Unknown error occurred');
      }

      setTimeout(() => setError(''), 5000);
    }
  };
  return (
    <main>
      <h1>Ilari's Flight Diaries</h1>
      <NewEntryForm error={error} onSubmit={submitNewDiaryEntry} />
      <DiaryEntriesList diaryEntries={diaryEntries} />
    </main>
  );
};

export default App;
