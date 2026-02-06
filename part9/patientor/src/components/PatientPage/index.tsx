import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import patientService from "../../services/patients";
import { Diagnosis, NewEntry, Patient } from "../../types";
import AddEntryModal from "../AddEntryModal";
import EntryDetails from "./EntryDetails";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patient = await patientService.getPatient(id);
        setPatient(patient);
      }
    };
    void fetchPatient();
  }, [id]);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: NewEntry) => {
    if (!id || !patient) return;

    try {
      const entry = await patientService.addEntry(id, values);
      setPatient({
        ...patient,
        entries: patient.entries.concat(entry),
      });
      setModalOpen(false);
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response?.data) {
          const data = e.response.data;

          if (typeof data === "object" && "error" in data) {
            setError(data.error);
          } else if (typeof data === "string") {
            const message = e.response.data.replace(
              "Something went wrong. Error: ",
              "",
            );
            console.error(message);
            setError(message);
          } else {
            setError("Invalid error format from server");
          }
        } else {
          setError("No response from server");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error occurred");
      }
    }
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  const getGenderIcon = () => {
    switch (patient.gender) {
      case "male":
        return <MaleIcon />;
      case "female":
        return <FemaleIcon />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Box mt={2}>
        <Typography variant="h4">
          {patient.name} {getGenderIcon()}
        </Typography>
        <Typography>SSN: {patient.ssn}</Typography>
        <Typography>Occupation: {patient.occupation}</Typography>
      </Box>

      <Box mt={3}>
        <Typography variant="h5" mb={2}>
          Entries
        </Typography>
        <Button
          variant="contained"
          onClick={openModal}
          style={{ marginBottom: "1em" }}
        >
          Add New Entry
        </Button>

        {patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}
      </Box>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
        diagnoses={diagnoses}
      />
    </div>
  );
};

export default PatientPage;
