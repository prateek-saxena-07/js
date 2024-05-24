const apiKey = "f36eb96f5ca179c60031979a9d6197f0";
const searchInput = document.getElementById("city-search");
const searchButton = document.getElementById("search-btn");
const locationButton = document.getElementById("location-btn");
const weatherDisplay = document.getElementById("weather-display");
const cityDropdown = document.getElementById("city-dropdown");

async function fetchWeather(query) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    displayError(error.message);
  }
}

function displayWeather(data) {
  const city = data.name;
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const icon = data.weather[0].icon;
  // console.log("icon", icon);
  const Parent = weatherDisplay.childNodes;
  console.log(data);
  Parent[1].textContent = city;
  Parent[3].childNodes[1].classList.remove("hidden");
  Parent[3].childNodes[1].src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  Parent[3].childNodes[3].innerHTML = `<span>Temprature:${temp}</span><br>
                                        <span>Humidity:${humidity}</span><br>
                                        <span>Wind Speed${windSpeed}</span>`;
  console.log(weatherDisplay.childNodes[0]);
  console.log(weatherDisplay.childNodes[1]);
  console.log(weatherDisplay.childNodes[2]);
  console.log(weatherDisplay.childNodes[3]);
  console.log(weatherDisplay.childNodes[4]);
  console.log(weatherDisplay.childNodes[5]);
}
function displayError(message) {
  weatherDisplay.innerHTML = `<p class="text-red-500 font-bold">${message}</p>`;
}

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value;

  fetchWeather(searchTerm)
    .then((data) => displayWeather(data))
    .catch((error) => console.error(error));
});
