import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { exerciseCalculator } from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!req.query.height || !req.query.weight) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  if (height <= 0 || weight <= 0) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(height, weight);

  return res.json({
    height,
    weight,
    bmi,
  });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, daily_exercises } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }

  if (!Array.isArray(daily_exercises)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const targetNumber = Number(target);
  if (isNaN(targetNumber)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const exercises: number[] = daily_exercises.map((e) => Number(e));

  if (exercises.some(isNaN)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const result = exerciseCalculator(targetNumber, exercises);

  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
