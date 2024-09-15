// Weather Dashboard JavaScript

// API Configuration
// Replace 'YOUR_API_KEY_HERE' with your actual OpenWeatherMap API key
const API_KEY = '0860f19e5f75c9c18ceb18cd26f4a4c7';

// DOM Elements
// Get references to important elements in the HTML
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast-container');

// Event Listeners
// Add click event listeners to the search button and search history
searchBtn.addEventListener('click', handleSearch);
searchHistory.addEventListener('click', handleHistoryClick);

// Main Functions

// Handle the search when the search button is clicked
async function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        const weatherData = await getWeatherData(city);
        updateWeatherDisplay(weatherData);
        addToSearchHistory(city);
    }
}

// Handle clicks on the search history buttons
function handleHistoryClick(event) {
    if (event.target.classList.contains('history-btn')) {
        cityInput.value = event.target.textContent;
        handleSearch();
    }
}

// Fetch weather data from the API
async function getWeatherData(city) {
    try {
        // First, get coordinates for the city
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        console.log("Geo Data: ", geoData);

        if (geoData.length === 0) {
            throw new Error('City not found');
        }

        const { lat, lon } = geoData[0];

        // Then, get 5 day / 3 hour forecast data using coordinates
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        console.log("Forecast Data: ", forecastData);

        return forecastData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

// Update the weather display on the page
function updateWeatherDisplay(data) {
    // Update current weather (using the first item in the list)
    const current = data.list[0];
    currentWeather.innerHTML = `
        <h2>${data.city.name} (${new Date(current.dt * 1000).toLocaleDateString()}) 
            <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}.png" alt="${current.weather[0].description}">
        </h2>
        <p>Temp: ${current.main.temp.toFixed(2)}°F</p>
        <p>Wind: ${current.wind.speed.toFixed(2)} MPH</p>
        <p>Humidity: ${current.main.humidity}%</p>
    `;

    // Update 5-day forecast
    forecastContainer.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        forecastCard.innerHTML = `
            <h4>${new Date(day.dt * 1000).toLocaleDateString()}</h4>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            <p>Temp: ${day.main.temp.toFixed(2)}°F</p>
            <p>Wind: ${day.wind.speed.toFixed(2)} MPH</p>
            <p>Humidity: ${day.main.humidity}%</p>
        `;
        forecastContainer.appendChild(forecastCard);
    }
}

// Add a city to the search history
function addToSearchHistory(city) {
    const historyBtn = document.createElement('button');
    historyBtn.classList.add('history-btn');
    historyBtn.textContent = city;
    searchHistory.prepend(historyBtn);

    // Limit history to 8 items
    if (searchHistory.children.length > 8) {
        searchHistory.removeChild(searchHistory.lastChild);
    }
}