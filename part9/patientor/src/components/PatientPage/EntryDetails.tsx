import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import { Box, Typography } from "@mui/material";
import { Diagnosis, Entry } from "../../types";
import HealthRatingBar from "../HealthRatingBar";

type EntryDetailsProps = {
  entry: Entry;
  diagnoses: Diagnosis[];
};

const EntryDetails = ({ entry, diagnoses }: EntryDetailsProps) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
  };

  const DiagnosisList = ({ codes }: { codes: string[] }) => (
    <ul>
      {codes.map((code) => {
        const diagnosis = diagnoses.find((d) => d.code === code);
        return (
          <li key={code}>
            {code} {diagnosis?.name}
          </li>
        );
      })}
    </ul>
  );

  switch (entry.type) {
    case "Hospital":
      return (
        <Box border={1} borderRadius={2} p={2} mb={2}>
          <Typography>
            {entry.date} <LocalHospitalIcon />
          </Typography>
          <Typography>
            <em>{entry.description}</em>
          </Typography>
          {entry.diagnosisCodes && (
            <DiagnosisList codes={entry.diagnosisCodes} />
          )}
          <Typography>
            Discharge: {entry.discharge.date} - {entry.discharge.criteria}
          </Typography>
          <Typography>diagnose by {entry.specialist}</Typography>
        </Box>
      );

    case "OccupationalHealthcare":
      return (
        <Box border={1} borderRadius={2} p={2} mb={2}>
          <Typography>
            {entry.date} <WorkIcon /> <em>{entry.employerName}</em>
          </Typography>
          <Typography>
            <em>{entry.description}</em>
          </Typography>
          {entry.diagnosisCodes && (
            <DiagnosisList codes={entry.diagnosisCodes} />
          )}
          {entry.sickLeave && (
            <Typography>
              Sick leave: {entry.sickLeave.startDate} to{" "}
              {entry.sickLeave.endDate}
            </Typography>
          )}
          <Typography>diagnose by {entry.specialist}</Typography>
        </Box>
      );

    case "HealthCheck":
      return (
        <Box border={1} borderRadius={2} p={2} mb={2}>
          <Typography>
            {entry.date} <LocalHospitalIcon />
          </Typography>
          <Typography>
            <em>{entry.description}</em>
          </Typography>
          {entry.diagnosisCodes && (
            <DiagnosisList codes={entry.diagnosisCodes} />
          )}
          <HealthRatingBar showText={false} rating={entry.healthCheckRating} />
          <Typography>diagnose by {entry.specialist}</Typography>
        </Box>
      );

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
