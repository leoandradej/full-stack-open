import express, { NextFunction, Request, Response } from "express";
import z from "zod";
import patientService from "../services/patientService";
import { NewEntry, NewPatient, NonSensitivePatient, Patient } from "../types";
import { newEntrySchema, newPatientSchema } from "../utils";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.json(patientService.getPatientFormValues());
});

router.get("/:id", (req: Request, res: Response) => {
  const patient = patientService.findPatientById(String(req.params.id));

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404).send({ error: "Patient not found" });
  }
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newEntrySchema.parse(req.body);
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

router.post(
  "/:id/entries",
  newEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response) => {
    const patient = patientService.findPatientById(req.params.id);

    if (!patient) {
      res.status(404).send({ error: "Patient not found" });
      return;
    }

    const addedEntry = patientService.addEntry(patient, req.body);
    res.json(addedEntry);
  },
);

router.use(errorMiddleware);

export default router;
