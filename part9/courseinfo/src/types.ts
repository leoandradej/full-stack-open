type CoursePartBase = {
  name: string;
  exerciseCount: number;
};

type CoursePartDescription = CoursePartBase & {
  description: string;
};

type CoursePartBasic = CoursePartDescription & {
  kind: "basic";
};

type CoursePartGroup = CoursePartBase & {
  groupProjectCount: number;
  kind: "group";
};

type CoursePartBackground = CoursePartDescription & {
  backgroundMaterial: string;
  kind: "background";
};

type CoursePartSpecial = CoursePartDescription & {
  requirements: string[];
  kind: "special";
};

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;
