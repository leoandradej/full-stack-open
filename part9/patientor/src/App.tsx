import { Button, Container, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Patient } from "./types";

import PatientListPage from "./components/PatientListPage";
import patientService from "./services/patients";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    //void axios.get<void>(`${apiBaseUrl}`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Button
            component={Link}
            to="/patients"
            variant="contained"
            color="primary"
          >
            Patients
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route
              path="/patients"
              element={
                <PatientListPage
                  patients={patients}
                  setPatients={setPatients}
                />
              }
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
