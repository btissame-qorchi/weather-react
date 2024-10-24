import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import search_icon from "../assets/search.png";
import cloud_icon from "../assets/cloud.png";
import clear_icon from "../assets/clear.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import humidity from "../assets/humidity.png";
import wind from "../assets/wind.png";

const Weather = () => {
  const inputRef = useRef(); // Reference to the input field
  const [weatherData, setWeatherData] = useState(null); // State to store weather data

  // Mapping weather icon codes to corresponding image assets
  const icons = {
    "01d": clear_icon,
    "02d": cloud_icon,
    "03d": cloud_icon,
    "04d": drizzle_icon,
    "09d": rain_icon,
    "10d": rain_icon,
    "13d": snow_icon,
    "01n": clear_icon,
    "02n": cloud_icon,
    "03n": cloud_icon,
    "04n": drizzle_icon,
    "09n": rain_icon,
    "10n": rain_icon,
    "13n": snow_icon,
  };

  // Function to fetch weather data from the API
  const search = async (city) => {
    // Check if the city input is empty or contains only spaces
    if (!city.trim()) {
      alert("Please provide the name of the city.");
      return;
    }

    try {
      // Get the API key from environment variables
      const apiKey = import.meta.env.VITE_API_ID;
      // Construct the API URL with the provided city and API key
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

      // Make the API request
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      // Check if the API response is not OK
      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Get the appropriate weather icon from the icon code
      const icon = icons[data.weather[0].icon] || clear_icon;

      // Set the weather data in the state
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description : data.weather[0].description,
        temperature: Math.floor(data.main.temp), // Round temperature to an integer
        city: data.name,
        icon,
      });
    } catch (error) {
      setWeatherData(null); // Reset weather data in case of an error
      alert("Failed to fetch weather data.");
    }
  };

  // Function to handle Enter key press in the search input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(inputRef.current.value); // Call search function when Enter is pressed
    }
  };

  // Fetch weather data for "New York" when the component mounts
  useEffect(() => {
    search("Paris");
  }, []);

  return (
    <div className="weather_box">
      <div className="search">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={handleKeyDown}
        />
        <div
          className="search-icon"
          onClick={() => search(inputRef.current.value)} // Trigger search on click
        >
          <img src={search_icon} alt="Search" width="18" />
        </div>
      </div>

      {/* Render weather data if available */}
      {weatherData && (
        <>
          <div className="city">
            <p>{weatherData.city}</p>
          </div>
          <div className="temperature">
            <p>
              {weatherData.temperature}<sup>°</sup>
            </p>
            <span>{weatherData.description}</span>
          </div>

          <div className="weather_icon">
            <img src={weatherData.icon} alt="Weather Icon" />
          </div>
          <div className="data">
            {/* Display humidity and wind speed */}
            <div className="item">
              <img src={humidity} width="20" alt="Humidity" />
              <div>
                <p>{weatherData.humidity}</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="item">
              <img src={wind} width="20" alt="Wind Speed" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
