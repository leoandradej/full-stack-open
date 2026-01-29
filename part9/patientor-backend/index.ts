import cors from "cors";
import express from "express";
import patients from "./data/patients";

const app = express();

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/api/patients", (_req, res) => {
  res.json(patients);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
