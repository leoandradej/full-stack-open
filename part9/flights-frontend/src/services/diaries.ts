import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api';

const getAll = async () => {
  const { data } = await axios.get<DiaryEntry[]>(`${baseUrl}/diaries`);

  return data;
};

const createDiaryEntry = async (object: NewDiaryEntry) => {
  const { data } = await axios.post<DiaryEntry>(`${baseUrl}/diaries`, object);

  return data;
};

export default { getAll, createDiaryEntry };
