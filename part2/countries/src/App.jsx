import { useState, useEffect } from "react";
import axios from "axios";
import { useWeather } from "./hooks/useWeather";
import CountryList from "./components/CountryList";
import CountryDetails from "./components/CountryDetails";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredCountries = searchTerm
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const countryToDisplay =
    selectedCountry ||
    (filteredCountries.length === 1 ? filteredCountries[0] : null);

  const { weather } = useWeather(countryToDisplay?.capital?.[0]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSelectedCountry(null);
  };

  const handleShowDetails = (country) => {
    setSelectedCountry(country);
  };

  const renderContent = () => {
    if (!searchTerm) return null;

    if (isLoading) return <p>Loading countries...</p>;

    const count = filteredCountries.length;

    if (count === 0) {
      return <p>No matches found</p>;
    }

    if (count > 10) {
      return <p>Too many matches, specify another filter</p>;
    }

    if (count > 1) {
      return (
        <CountryList
          countries={filteredCountries}
          onShowDetails={handleShowDetails}
        />
      );
    }

    return null;
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
        find countries:{" "}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Type to search..."
        />
      </div>
      {renderContent()}
      <CountryDetails country={countryToDisplay} weather={weather} />
    </div>
  );
};

export default App;
