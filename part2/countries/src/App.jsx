import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
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
    setSelectedCountry(null);
  };

  const handleDisplayDetails = (countryName) => {
    const country = countries.find((c) => c.name.common === countryName);
    setSelectedCountry(country);
  };

  let filteredCountries = [];

  if (searchTerm !== "") {
    filteredCountries = countries.filter((country) =>
      country["name"].common.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const countryToDisplay =
    selectedCountry ||
    (filteredCountries.length === 1 ? filteredCountries[0] : null);

  useEffect(() => {
    if (countryToDisplay && countryToDisplay.capital?.[0]) {
      const API_KEY = import.meta.env.VITE_WEATHER_API_API_KEY;
      const WEATHER_API_URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${countryToDisplay.capital[0]}&aqi=no`;

      axios
        .get(WEATHER_API_URL)
        .then((response) => response.data)
        .then((weatherData) => setWeather(weatherData))
        .catch((error) => {
          console.error("Error fetching weather:", error);
          setWeather(null);
        });
    }
  }, [countryToDisplay]);

  const renderCountries = () => {
    if (searchTerm === "") {
      return null;
    }

    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    }

    if (filteredCountries.length > 1) {
      return filteredCountries.map((c) => (
        <div key={c.name.common}>
          <p>
            {c.name.common}{" "}
            <button onClick={() => handleDisplayDetails(c.name.common)}>
              show
            </button>
          </p>
        </div>
      ));
    }

    return null;
  };

  const renderCountryDetails = () => {
    if (!countryToDisplay) return null;

    return (
      <div>
        <h1>{countryToDisplay.name.common}</h1>
        <p>Capital: {countryToDisplay.capital?.[0]}</p>
        <p>Area: {countryToDisplay.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(countryToDisplay.languages || {}).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img
          src={countryToDisplay.flags.png}
          alt={`Flag of ${countryToDisplay.name.common}`}
          width="200"
        />
        {weather && (
          <>
            <h2>Weather in {countryToDisplay.capital?.[0]}</h2>
            <p>Temperature {weather.current.temp_c} Celsius</p>
            <img src={weather.current.condition.icon} alt="Weather Icon" />
            <p>Wind {weather.current.wind_kph} km/h</p>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <div>
        find countries:{" "}
        <input type="text" value={searchTerm} onChange={handleCountrySearch} />
      </div>
      {renderCountries()}
      {renderCountryDetails()}
    </div>
  );
};

export default App;
