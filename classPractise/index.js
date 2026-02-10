const API_KEY = "3ff6ea7c9c66b811078e2627c893991c";
const baseUrl = "https://api.openweathermap.org/";

// DOM elements
const input = document.querySelector("input");
const button = document.querySelector(".search");
const cityEl = document.querySelector(".city");
const tempEl = document.querySelector(".temp");
const conditionEl = document.querySelector(".condition");
const loader = document.querySelector(".loader");
const errorEl = document.querySelector(".error");

let errorTimer = null;

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");

  if (errorTimer) clearTimeout(errorTimer);

  errorTimer = setTimeout(() => {
    errorEl.classList.add("hidden");
    errorEl.textContent = "";
  }, 10000);
}

// Main function
async function getWeather(city) {
  loader.classList.remove("hidden");
  button.disabled = true;
  errorEl.classList.add("hidden");

  try {
    // 1️⃣ Geocoding
    const geoRes = await fetch(
      `${baseUrl}geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );

    if (!geoRes.ok) throw new Error("Geocoding failed");

    const geoData = await geoRes.json();

    if (!geoData.length) {
      showError("City not found. Please check spelling.");
      return;
    }

    const { lat, lon, name } = geoData[0];

    // 2️⃣ Weather
    const weatherRes = await fetch(
      `${baseUrl}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!weatherRes.ok) throw new Error("Weather fetch failed");

    const weatherData = await weatherRes.json();

    // 3️⃣ Update UI
    const temp = Math.round(weatherData.main.temp);

    cityEl.textContent = name;
    tempEl.textContent = `${temp}°C`;
    conditionEl.textContent = weatherData.weather[0].description;

    if (temp <= 10) tempEl.style.color = "blue";
    else if (temp <= 25) tempEl.style.color = "green";
    else tempEl.style.color = "red";

  } catch (error) {
    console.error(error);
    showError("Unable to fetch weather data. Try again later.");
  } finally {
    loader.classList.add("hidden");
    button.disabled = false;
  }
}

// Event listener
button.addEventListener("click", () => {
  const city = input.value.trim();
  if (city) getWeather(city);
});
