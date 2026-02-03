import type { CoursePart } from "../types";

const Part = ({ part }: { part: CoursePart }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
  };

  const renderPartDetails = () => {
    switch (part.kind) {
      case "basic":
        return <span className="description">{part.description}</span>;
      case "group":
        return <span>Project Exercises: {part.groupProjectCount}</span>;
      case "background":
        return <span>Submit to {part.backgroundMaterial}</span>;
      case "special":
        return <span>Required Skills: {part.requirements.join(", ")}</span>;
      default:
        return assertNever(part);
    }
  };
  return (
    <div className="part">
      <p>
        <strong>
          {part.name} {part.exerciseCount}
        </strong>
      </p>
      {renderPartDetails()}
    </div>
  );
};

export default Part;
