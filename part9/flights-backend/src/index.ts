import cors from "cors";
import express from "express";
import diaryRouter from "./routes/diaries";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.use("/api/diaries", diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
