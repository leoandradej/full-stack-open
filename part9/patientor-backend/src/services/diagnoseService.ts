import diagnoses from "../../data/diagnoses";
import { Diagnosis } from "../types";

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const findDiagnosisByCode = (code: string): Diagnosis | undefined => {
  const diagnosis = diagnoses.find((d) => d.code === code);
  return diagnosis;
};

export default { getDiagnoses, findDiagnosisByCode };
