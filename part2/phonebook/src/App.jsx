import { useState } from "react";
import Searchbar from "./components/Searchbar";
import ContactForm from "./components/ContactForm";
import Contacts from "./components/Contacts";
import { useEffect } from "react";
import contactService from "./services/contacts";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);
  const [messageStatus, setMessageStatus] = useState("");

  useEffect(() => {
    contactService
      .getAll()
      .then((initialContacts) => setPersons(initialContacts));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} className={messageStatus} />
      <Searchbar search={search} setSearch={setSearch} />
      <ContactForm
        persons={persons}
        setPersons={setPersons}
        setMessage={setMessage}
        setMessageStatus={setMessageStatus}
      />
      <h2>Numbers</h2>
      <Contacts persons={persons} setPersons={setPersons} search={search} />
    </div>
  );
};

export default App;
