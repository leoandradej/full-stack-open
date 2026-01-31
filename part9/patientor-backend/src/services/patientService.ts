import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import { NewPatient, Patient, PatientFormValues } from "../types";

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

const addNewPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };

  patients.push(newPatient);

  return newPatient;
};

export default { getPatients, getPatientFormValues, addNewPatient };
