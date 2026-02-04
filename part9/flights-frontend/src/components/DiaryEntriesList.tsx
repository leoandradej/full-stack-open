import type { DiaryEntry } from '../types';

const DiaryEntriesList = ({ diaryEntries }: { diaryEntries: DiaryEntry[] }) => {
  return (
    <div>
      <h2>Diary Entries</h2>
      {diaryEntries.map((entry) => (
        <div key={entry.id} className="entry-details">
          <h3>{entry.date}</h3>
          <span>Visibility: {entry.visibility}</span>
          <span>Weather: {entry.weather}</span>
        </div>
      ))}
    </div>
  );
};

export default DiaryEntriesList;
