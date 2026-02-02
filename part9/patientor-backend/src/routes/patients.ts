import express, { NextFunction, Request, Response } from "express";
import z from "zod";
import patientService from "../services/patientService";
import { NewPatient, Patient, PatientFormValues } from "../types";
import { newPatientSchema } from "../utils";

const router = express.Router();

router.get("/", (_req, res: Response<PatientFormValues[]>) => {
  res.json(patientService.getPatientFormValues());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof z.ZodError) {
    const errorMessages = error.issues.map((issue) => {
      const field = issue.path.join(".");
      return `${field}: ${issue.message}`;
    });

    return res.status(400).json({
      error: errorMessages.join(", "),
    });
  } else {
    return next(error);
  }
};

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addNewPatient(req.body);
    res.json(addedPatient);
  },
);

router.use(errorMiddleware);

export default router;
