const CountryDetails = ({ country, weather }) => {
  if (!country) return null;

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital?.[0]}</p>
      <p>Area: {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages || {}).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="200"
      />

      {weather && (
        <div>
          <h2>Weather in {country.capital?.[0]}</h2>
          <p>Temperature: {weather.current.temp_c}ºC</p>
          <img
            src={weather.current.condition.icon}
            alt={weather.current.condition.text}
          />
          <p>Wind: {weather.current.wind_kph}km/h</p>
        </div>
      )}
    </div>
  );
};

export default CountryDetails;
