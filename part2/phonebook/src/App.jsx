import { useState } from "react";
import Searchbar from "./components/Searchbar";
import ContactForm from "./components/ContactForm";
import Contacts from "./components/Contacts";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [search, setSearch] = useState("");

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
