import express, { Request, Response } from "express";
import diagnoseService from "../services/diagnoseService";
import { Diagnosis } from "../types";

const router = express.Router();

router.get("/", (_req, res: Response<Diagnosis[]>) => {
  res.json(diagnoseService.getDiagnoses());
});

router.get("/:id", (req: Request, res: Response) => {
  const diagnosis = diagnoseService.findDiagnosisByCode(
    String(req.params.code),
  );

  if (diagnosis) {
    res.send(diagnosis);
  } else {
    res.sendStatus(404);
  }
});

export default router;
