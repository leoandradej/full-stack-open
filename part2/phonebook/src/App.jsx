import { useState } from "react";
import Searchbar from "./components/Searchbar";
import ContactForm from "./components/ContactForm";
import Contacts from "./components/Contacts";
import axios from "axios";
import { useEffect } from "react";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then((response) => setPersons(response.data));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Searchbar search={search} setSearch={setSearch} />
      <ContactForm persons={persons} setPersons={setPersons} />
      <h2>Numbers</h2>
      <Contacts persons={persons} search={search} />
    </div>
  );
};

export default App;
