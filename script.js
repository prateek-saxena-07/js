const apiKey = "f36eb96f5ca179c60031979a9d6197f0";
const searchInput = document.getElementById("city-search");
const searchButton = document.getElementById("search-btn");
const locationButton = document.getElementById("location-btn");
const weatherDisplay = document.getElementById("weather-display");
const cityDropdown = document.getElementById("city-dropdown");
const fiveDayDiv = document.getElementById("5-Day-Forecast");

async function fetchWeather(query) {
  const url =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    query +
    "&appid=f36eb96f5ca179c60031979a9d6197f0&unit=metric";
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
  const city = data.city.name;
  const desc = data.list[0].weather[0].description;
  const temp = Math.round(data.list[0].main.temp - 273) + "°C";
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;
  const icon = data.list[0].weather[0].icon;
  // console.log("icon", icon);
  const Parent = weatherDisplay.childNodes;
  console.log(data);
  Parent[1].textContent = city;
  Parent[3].childNodes[1].classList.remove("hidden");
  Parent[3].childNodes[1].src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  Parent[3].childNodes[3].innerHTML = `<span>Temprature:${temp}</span><br>
                                      <span>Humidity:  ${humidity} %</span><br>
                                      <span>Wind Speed: ${windSpeed} m/sec</span><br>
                                      <span>Description: ${desc}</span>`;
  // console.log(weatherDisplay.childNodes[0]);
  // console.log(weatherDisplay.childNodes[1]);
  // console.log(weatherDisplay.childNodes[2]);
  // console.log(weatherDisplay.childNodes[3]);
  // console.log(weatherDisplay.childNodes[4]);
  // console.log(weatherDisplay.childNodes[5]);
}
function displayError(message) {
  weatherDisplay.innerHTML = `<p class="text-red-500 font-bold">${message}</p>`;
}
function extended(data) {
  // console.log(fiveDayDiv.childNodes);
  // console.log(fiveDayDiv.childNodes[5].childNodes[1].childNodes);
  // console.log(fiveDayDiv.childNodes[1].childNodes[1].childNodes[1]);
  // console.log(fiveDayDiv.childNodes[1].childNodes[1].childNodes[3]);

  for (let i = 1, j = 1; i < 6; i++, j += 2) {
    let itag1 = fiveDayDiv.childNodes[j].childNodes[1].childNodes[1];
    let htag1 = fiveDayDiv.childNodes[j].childNodes[1].childNodes[3];
    let ptag1 = fiveDayDiv.childNodes[j].childNodes[1].childNodes[5];
    let Date = data.list[i * 8 - 1].dt_txt;
    let temp = Math.round(data.list[i * 8 - 1].main.temp - 273) + "°C";
    let icon = data.list[i * 8 - 1].weather[0].icon;
    itag1.classList.remove("hidden");
    itag1.classList.add("m-auto", "block");
    itag1.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    ptag1.textContent = Date;
    htag1.textContent = temp;
  }
}

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value;

  fetchWeather(searchTerm)
    .then((data) => {
      displayWeather(data);

      extended(data);
    })
    .catch((error) => console.error(error));
});
