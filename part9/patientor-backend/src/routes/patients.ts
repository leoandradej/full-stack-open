import express, { Response } from "express";
import patientService from "../services/patientService";
import { PatientFormValues } from "../types";

const router = express.Router();

router.get("/api/patients", (_req, res: Response<PatientFormValues[]>) => {
  res.json(patientService.getPatientFormValues());
});

export default router;
