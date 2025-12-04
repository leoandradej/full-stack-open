const Total = ({ parts }) => {
  return (
    <p>
      Total of {parts[0].exercises + parts[1].exercises + parts[2].exercises}{" "}
      exercises
    </p>
  );
};

export default Total;
