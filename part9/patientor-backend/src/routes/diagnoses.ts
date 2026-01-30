import express, { Response } from "express";
import diagnoseService from "../services/diagnoseService";
import { Diagnosis } from "../types";

const router = express.Router();

router.get("/api/diagnoses", (_req, res: Response<Diagnosis[]>) => {
  res.json(diagnoseService.getDiagnoses());
});

export default router;
