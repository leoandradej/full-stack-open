import contactService from "../services/contacts";

const Contacts = ({ persons, setPersons, search }) => {
  const filteredPersons = persons.filter((person) =>
    person["name"].toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteContact = (id, name) => {
    window.confirm(`Are you sure you want to delete ${name}?`);
    contactService
      .deleteContact(id)
      .then(() => {
        setPersons((prev) => prev.filter((person) => person.id !== id));
      })
      .catch((error) => {
        console.error(`Failed to delete contact with the id ${id}: `, error);
      });
  };

  return (
    <div>
      {filteredPersons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}
          <button onClick={() => handleDeleteContact(person.id, person.name)}>
            delete
          </button>
        </p>
      ))}
    </div>
  );
};

export default Contacts;
