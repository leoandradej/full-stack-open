import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good * 1 + neutral * 0 + bad * -1) / total;
  const positive = total === 0 ? 0 : (good / total) * 100;

  const handleClick = (e) => {
    if (e.target.innerText === "good") {
      setGood(good + 1);
    } else if (e.target.innerText === "neutral") {
      setNeutral(neutral + 1);
    } else {
      setBad(bad + 1);
    }
  };

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={handleClick} text="good" />
      <Button onClick={handleClick} text="neutral" />
      <Button onClick={handleClick} text="bad" />

      <h1>Statistics</h1>
      <p>good: {good}</p>
      <p>neutral: {neutral}</p>
      <p>bad: {bad}</p>
      <p>all: {total}</p>
      <p>average: {average.toFixed(2)}</p>
      <p>positive: {positive.toFixed(1)}%</p>
    </div>
  );
};

export default App;
