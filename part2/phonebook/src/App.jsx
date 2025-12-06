import { useState } from "react";
import Searchbar from "./components/Searchbar";
import ContactForm from "./components/ContactForm";
import Contacts from "./components/Contacts";
import { useEffect } from "react";
import contactService from "./services/contacts";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    contactService
      .getAll()
      .then((initialContacts) => setPersons(initialContacts));
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
