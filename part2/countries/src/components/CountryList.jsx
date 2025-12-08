const CountryList = ({ countries, onShowDetails }) => {
  return (
    <div>
      {countries.map((country) => (
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={() => onShowDetails(country)}>show</button>
        </div>
      ))}
    </div>
  );
};

export default CountryList;
