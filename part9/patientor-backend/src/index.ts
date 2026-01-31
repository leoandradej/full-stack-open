import cors from "cors";
import express from "express";
import diagnoseRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.use("/api/patients", patientRouter);

app.use("/api/diagnoses", diagnoseRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
