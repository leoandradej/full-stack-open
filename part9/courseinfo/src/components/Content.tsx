interface CoursePartsProps {
  name: string;
  exerciseCount: number;
}

const Content = ({ courseParts }: { courseParts: CoursePartsProps[] }) => {
  return (
    <>
      {courseParts.map((part) => (
        <p>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </>
  );
};

export default Content;
