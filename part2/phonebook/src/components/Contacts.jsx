const Contacts = ({ persons, search }) => {
  const filteredPersons = persons.filter((person) =>
    person["name"].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {filteredPersons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}
        </p>
      ))}
    </div>
  );
};

export default Contacts;
