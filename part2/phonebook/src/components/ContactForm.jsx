import { useState } from "react";
import contactService from "../services/contacts";

const ContactForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      persons.some(
        (person) => person["name"].toLowerCase() === newName.toLowerCase()
      )
    ) {
      alert(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      const contact = persons.find(
        (person) => person.name.toLowerCase() === newName.toLowerCase()
      );
      const updatedContact = { ...contact, number: newNumber };

      contactService
        .updateContact(contact.id, updatedContact)
        .then((returnedContact) => {
          setPersons(
            persons.map((person) =>
              person.id === contact.id ? returnedContact : person
            )
          );
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => console.error("Failed to update contact: ", error));

      return;
    }

    const newContact = {
      name: capitalizeName(newName),
      number: newNumber,
    };

    contactService.createContact(newContact).then((returnedContact) => {
      setPersons(persons.concat(returnedContact));
      setNewName("");
      setNewNumber("");
    });
  };

  const handleNewName = (e) => {
    setNewName(e.target.value);
  };

  const handleNewNumber = (e) => {
    setNewNumber(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a New Contact</h2>
      <div>
        name: <input type="text" value={newName} onChange={handleNewName} />
      </div>
      <div>
        number:{" "}
        <input type="phone" value={newNumber} onChange={handleNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default ContactForm;
