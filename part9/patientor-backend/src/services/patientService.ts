import patients from "../../data/patients";
import { Patient, PatientFormValues } from "../types";

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientFormValues = (): PatientFormValues[] => {
  return patients.map(({ id, name, occupation, gender, dateOfBirth }) => ({
    id,
    name,
    occupation,
    gender,
    dateOfBirth,
  }));
};

export default { getPatients, getPatientFormValues };
