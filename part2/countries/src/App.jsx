import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const BASE_URL = "https://studies.cs.helsinki.fi/restcountries/api";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/all`)
      .then((response) => response.data)
      .then((allCountries) => setCountries(allCountries));
  }, []);

  const handleCountrySearch = (e) => {
    setSearchTerm(e.target.value);
  };

  let filteredCountries = [];

  if (searchTerm !== "") {
    filteredCountries = countries.filter((country) =>
      country["name"].common.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const renderCountries = () => {
    if (searchTerm === "") {
      return null;
    }

    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    }

    if (filteredCountries.length > 1) {
      return filteredCountries.map((country) => (
        <p key={country.name.common}>{country.name.common}</p>
      ));
    }

    if (filteredCountries.length === 1) {
      const country = filteredCountries[0];
      return (
        <div>
          <h1>{country.name.common}</h1>
          <p>Capital: {country.capital?.[0]}</p>
          <p>Area: {country.area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.values(country.languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            width="200"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <div>
        find countries:{" "}
        <input type="text" value={searchTerm} onChange={handleCountrySearch} />
      </div>
      {renderCountries()}
    </div>
  );
};

export default App;
