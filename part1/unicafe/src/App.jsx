import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Statistics = ({ good, neutral, bad, total, average, positive }) => {
  return (
    <>
      <h1>Statistics</h1>
      {total === 0 ? (
        "No feedback given"
      ) : (
        <>
          <table>
            <tbody>
              <StatisticTableLine text="good" value={good} />
              <StatisticTableLine text="neutral" value={neutral} />
              <StatisticTableLine text="bad" value={bad} />
              <StatisticTableLine text="all" value={total} />
              <StatisticTableLine text="average" value={average.toFixed(2)} />
              <StatisticTableLine text="positive" value={positive.toFixed(1)} />
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

const StatisticTableLine = ({ text, value }) =>
  text === "positive" ? (
    <tr>
      <td>{text}</td>
      <td>{value}%</td>
    </tr>
  ) : (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );

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
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
