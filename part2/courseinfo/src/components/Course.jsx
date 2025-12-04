import Content from "./Content";
import Header from "./Header";
import Total from "./Total";

const Course = ({ course }) => {
  return (
    <div>
      {course.map((item) => (
        <div key={item.id}>
          <h1>Web Development Curriculum</h1>
          <Header name={item.name} />
          <Content parts={item.parts} />
          <Total parts={item.parts} />
        </div>
      ))}
    </div>
  );
};

export default Course;
