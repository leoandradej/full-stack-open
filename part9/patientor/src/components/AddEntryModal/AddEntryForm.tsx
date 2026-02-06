import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Diagnosis, HealthCheckRating, NewEntry } from "../../types";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
  error?: string;
  diagnoses: Diagnosis[];
}

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const AddEntryForm = ({ onSubmit, onCancel, diagnoses }: Props) => {
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<
    string[]
  >([]);

  // HealthCheck fields
  const [healthCheckRating, setHealthCheckRating] = useState(
    HealthCheckRating.Healthy,
  );

  // Hospital fields
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // OccupationalHealthcare fields
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes:
        selectedDiagnosisCodes.length > 0 ? selectedDiagnosisCodes : undefined,
    };

    let newEntry: NewEntry;

    switch (entryType) {
      case "HealthCheck":
        newEntry = {
          ...baseEntry,
          type: "HealthCheck",
          healthCheckRating,
        };
        break;

      case "Hospital":
        newEntry = {
          ...baseEntry,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
        break;

      case "OccupationalHealthcare":
        newEntry = {
          ...baseEntry,
          type: "OccupationalHealthcare",
          employerName,
          sickLeave:
            sickLeaveStart && sickLeaveEnd
              ? {
                  startDate: sickLeaveStart,
                  endDate: sickLeaveEnd,
                }
              : undefined,
        };
        break;

      default:
        return;
    }

    onSubmit(newEntry);
  };

  const handleRatingChange = (event: SelectChangeEvent<number>) => {
    setHealthCheckRating(Number(event.target.value) as HealthCheckRating);
  };

  const handleDiagnosisCodesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedDiagnosisCodes(
      typeof value === "string" ? value.split(",") : value,
    );
  };

  return (
    <Box>
      <Typography variant="h6">New Entry</Typography>

      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Entry Type</FormLabel>
          <RadioGroup
            row
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as EntryType)}
          >
            <FormControlLabel
              value="HealthCheck"
              control={<Radio />}
              label="Health Check"
            />
            <FormControlLabel
              value="Hospital"
              control={<Radio />}
              label="Hospital"
            />
            <FormControlLabel
              value="OccupationalHealthcare"
              control={<Radio />}
              label="Occupational Healthcare"
            />
          </RadioGroup>
        </FormControl>

        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          margin="normal"
          required
        />

        <TextField
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
        />

        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          margin="normal"
          required
        />

        {/* Improved diagnosis codes with multi-select */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={selectedDiagnosisCodes}
            onChange={handleDiagnosisCodesChange}
            input={<OutlinedInput label="Diagnosis Codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code} - {diagnosis.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* HealthCheck specific fields */}
        {entryType === "HealthCheck" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Health Check Rating</InputLabel>
            <Select
              value={healthCheckRating}
              label="Health Check Rating"
              onChange={handleRatingChange}
            >
              <MenuItem value={HealthCheckRating.Healthy}>Healthy (0)</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>
                Low Risk (1)
              </MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>
                High Risk (2)
              </MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>
                Critical Risk (3)
              </MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Hospital specific fields */}
        {entryType === "Hospital" && (
          <>
            <TextField
              label="Discharge Date"
              type="date"
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
              required
            />
            <TextField
              label="Discharge Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
              margin="normal"
              required
            />
          </>
        )}

        {/* OccupationalHealthcare specific fields */}
        {entryType === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              margin="normal"
              required
            />
            <Typography variant="subtitle2" mt={2} mb={1}>
              Sick Leave (optional)
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={sickLeaveStart}
                onChange={({ target }) => setSickLeaveStart(target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={sickLeaveEnd}
                onChange={({ target }) => setSickLeaveEnd(target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </>
        )}

        <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
          <Button color="secondary" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add Entry
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddEntryForm;
