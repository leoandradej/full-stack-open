import { Gender, NewPatient } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const isSsn = (ssn: string) => {
  const regex = /^\d{3}-\d{2}-\d{4}$/;

  return regex.test(ssn);
};

const isDateOfBirth = (date: string) => {
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = date.match(regex);

  if (!match) {
    return false;
  }
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (year < 1000 || year > 3000 || month === 0 || month > 12) {
    return false;
  }

  const dateObj = new Date(year, month - 1, day);

  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error("Incorrect or missing name");
  }

  return name;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }

  return occupation;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender " + gender);
  }

  return gender;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error("Incorrect or missing ssn");
  }

  if (!isSsn(ssn)) {
    throw new Error("Incorrect SSN format. Expect format: XXX-XX-XXXX");
  }

  return ssn;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth)) {
    throw new Error("Date of birth must be a string");
  }

  if (!isDateOfBirth(dateOfBirth)) {
    throw new Error("Incorrect date format. Expected format: YYYY-MM-DD");
  }

  return dateOfBirth;
};

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "occupation" in object &&
    "gender" in object &&
    "ssn" in object &&
    "dateOfBirth" in object
  ) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      occupation: parseOccupation(object.occupation),
      gender: parseGender(object.gender),
      ssn: parseSsn(object.ssn),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
    };

    return newPatient;
  }

  throw new Error("Incorrect data: some fields are missing");
};

export default toNewPatient;
