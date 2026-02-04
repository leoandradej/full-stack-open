import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Visibility, Weather, type NewDiaryEntry } from '../types';

type NewEntryFormProps = {
  error: string;
  onSubmit: (values: NewDiaryEntry) => void;
};

type VisibilityOption = {
  value: Visibility;
  label: string;
};

const visibilityOptions: VisibilityOption[] = Object.values(Visibility).map(
  (v) => ({
    value: v,
    label: v.toString(),
  })
);

type WeatherOption = {
  value: Weather;
  label: string;
};

const weatherOptions: WeatherOption[] = Object.values(Weather).map((v) => ({
  value: v,
  label: v.toString(),
}));

const NewEntryForm = ({ error, onSubmit }: NewEntryFormProps) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState(Visibility.Great);
  const [weather, setWeather] = useState(Weather.Sunny);
  const [comment, setComment] = useState('');

  const onVisibilityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (typeof e.target.value === 'string') {
      const value = e.target.value;
      const visibility = Object.values(Visibility).find(
        (g) => g.toString() === value
      );
      if (visibility) {
        setVisibility(visibility);
      }
    }
  };

  const onWeatherChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (typeof e.target.value === 'string') {
      const value = e.target.value;
      const weather = Object.values(Weather).find(
        (g) => g.toString() === value
      );
      if (weather) {
        setWeather(weather);
      }
    }
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    onSubmit({
      date,
      visibility,
      weather,
      comment,
    });

    setDate('');
    setComment('');
  };

  return (
    <div className="form-container">
      <h2>Add New Entry</h2>
      {error && <span className="error-message">{error}</span>}

      <form onSubmit={handleSubmit}>
        <div>
          Date:{' '}
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          Visibility:{' '}
          {visibilityOptions.map(({ value, label }) => (
            <label key={value} htmlFor="visibility">
              {label}
              <input
                type="radio"
                id={label}
                name="visibility"
                value={value}
                checked={visibility === value}
                onChange={(e) => onVisibilityChange(e)}
              />
            </label>
          ))}
        </div>
        <div>
          Weather:{' '}
          {weatherOptions.map(({ value, label }) => (
            <label key={value} htmlFor="weather">
              {label}
              <input
                type="radio"
                id={value}
                name="weather"
                value={value}
                checked={weather === value}
                onChange={(e) => onWeatherChange(e)}
              />
            </label>
          ))}
        </div>
        <div>
          Comment:{' '}
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewEntryForm;
