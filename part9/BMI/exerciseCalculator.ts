interface Results {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  target: number;
  trainingHours: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target = Number(args[2]);
  if (isNaN(target)) {
    throw new Error("Target value must be a number");
  }

  const trainingHours: number[] = [];
  for (let i = 3; i < args.length; i++) {
    const hours = Number(args[i]);
    if (isNaN(hours)) {
      throw new Error("All training hours must be numbers");
    }
    trainingHours.push(hours);
  }

  return {
    target,
    trainingHours,
  };
};

export const exerciseCalculator = (
  target: number,
  trainingHoursPerDay: number[],
): Results => {
  const totalTrainingHours = trainingHoursPerDay.reduce(
    (acc, currentValue) => acc + currentValue,
  );
  const averageTrainingHours = Number(
    (totalTrainingHours / trainingHoursPerDay.length).toFixed(2),
  );
  let rating;
  let ratingDescription;

  if (averageTrainingHours >= target) {
    rating = 3;
    ratingDescription = "Well done! Keep it up!";
  } else if (averageTrainingHours >= target / 2) {
    rating = 2;
    ratingDescription = "Not bad, but it could be better";
  } else {
    rating = 1;
    ratingDescription = "Too bad, try it harder next week!";
  }

  return {
    periodLength: trainingHoursPerDay.length,
    trainingDays: trainingHoursPerDay.filter((day) => day !== 0).length,
    success: averageTrainingHours >= target,
    rating,
    ratingDescription,
    target,
    average: averageTrainingHours,
  };
};

if (require.main === module) {
  try {
    const { target, trainingHours } = parseExerciseArguments(process.argv);
    console.log(exerciseCalculator(target, trainingHours));
  } catch (error: unknown) {
    let errorMessage = "Something bad happened";
    if (error instanceof Error) {
      errorMessage += " Error " + error.message;
    }
    console.log(errorMessage);
  }
}
