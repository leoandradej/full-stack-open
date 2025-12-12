import { useState } from "react";
import contactService from "../services/contacts";

const ContactForm = ({ persons, setPersons, setMessage, setMessageStatus }) => {
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

    // Check if contact already exists in the frontend state
    const existingContact = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingContact) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedContact = { ...existingContact, number: newNumber };

        contactService
          .updateContact(existingContact.id, updatedContact)
          .then((returnedContact) => {
            setMessageStatus("success");
            setMessage(`${returnedContact.name}'s phone number updated`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
            setPersons(
              persons.map((person) =>
                person.id === existingContact.id ? returnedContact : person
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            setMessageStatus("error");
            setMessage(
              `Information of ${existingContact.name} has already been removed from server`
            );
            setTimeout(() => {
              setMessage(null);
            }, 5000);
            setPersons(persons.filter((p) => p.id !== existingContact.id));
          });
      }
      return;
    }

    // Create new contact
    const newContact = {
      name: capitalizeName(newName),
      number: newNumber,
    };

    contactService
      .createContact(newContact)
      .then((returnedContact) => {
        setMessageStatus("success");
        setMessage(`Added ${returnedContact.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        setPersons(persons.concat(returnedContact));
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        setMessageStatus("error");
        // Handle duplicate name error from database
        if (error.response && error.response.status === 400) {
          setMessage(error.response.data.error || "Error adding contact");
        } else {
          setMessage("Error adding contact");
        }
        setTimeout(() => {
          setMessage(null);
        }, 5000);
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
        name:{" "}
        <input type="text" value={newName} onChange={handleNewName} required />
      </div>
      <div>
        number:{" "}
        <input
          type="tel"
          value={newNumber}
          onChange={handleNewNumber}
          required
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default ContactForm;
