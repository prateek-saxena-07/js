const apiKey = "f36eb96f5ca179c60031979a9d6197f0";
// const apiGeoKey = "870b2e3949e84f488b67378c0ce5ac77";
const searchInput = document.getElementById("city-search");
const searchButton = document.getElementById("search-btn");
const locationButton = document.getElementById("location-btn");
const weatherDisplay = document.getElementById("weather-display");

const dropdown = document.getElementById("recentCities");
// const recentCityDropdown = document.querySelectorAll("option");
const fiveDayDiv = document.getElementById("5-Day-Forecast");
const heading5 = document.getElementById("5dayheading");
const err = document.getElementById("error");
const recentCities = [];
localStorage.clear();

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
    displayError(error.message);
    return;
  }
}

function displayWeather(data) {
  if (!data || !data.city) {
    displayError("Invalid/Empty location");
    return;
  }
  addRecentCity(data.city.name);
  saveData();
  document.getElementById("recent-span").classList.remove("hidden");
  err.classList.add("hidden");
  weatherDisplay.classList.remove("hidden");
  const city = data.city.name;
  const desc = data.list[0].weather[0].description;
  const temp = Math.round(data.list[0].main.temp - 273) + "°C";
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;
  const icon = data.list[0].weather[0].icon;
  // console.log("icon", icon);
  const Parent = weatherDisplay.childNodes;
  console.log(weatherDisplay.childNodes);
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
  err.classList.remove("hidden");
  err.textContent = `${message}`;
  fiveDayDiv.classList.add("hidden");
  weatherDisplay.classList.add("hidden");
}
function extended(data) {
  // console.log(fiveDayDiv.childNodes);
  // console.log(fiveDayDiv.childNodes[5].childNodes[1].childNodes);
  // console.log(fiveDayDiv.childNodes[1].childNodes[1].childNodes[1]);
  // console.log(fiveDayDiv.childNodes[1].childNodes[1].childNodes[3]);
  if (!data || !data.list) {
    // Check for valid data and list property
    console.error("Invalid weather data");
    return;
  }
  // addRecentCity(data.city.name);
  // saveData();
  err.classList.add("hidden");
  fiveDayDiv.classList.remove("hidden");
  heading5.classList.remove("hidden");
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
    .catch((error) => {
      displayError(error);
    });
});
const success = async (position) => {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  console.log(lat, lon);
  const url1 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  try {
    const response1 = await fetch(url1);
    // console.log(response1);
    if (!response1.ok) {
      throw new Error("Failed to fetch current weather data");
    }
    var data1 = await response1.json();
    displayWeather(data1);
    extended(data1);
    // console.log(data1);
  } catch (error) {
    displayError(error.message);
    return;
  }
};

const failed = (error) => {
  displayError(error.message);
};

locationButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(success, failed);
});

function onRecentCityClick(event) {
  const selectedCity = event.target.value;
  if (selectedCity) {
    // Handle city selection (e.g., fetch weather)
    {
      fetchWeather(selectedCity)
        .then((data) => {
          displayWeather(data);

          extended(data);
        })
        .catch((error) => {
          displayError(error);
        });
    }
  }
}
dropdown.addEventListener("change", onRecentCityClick);

function addRecentCity(city) {
  if (recentCities.includes(city)) return;

  if (recentCities.length >= 5) {
    recentCities.shift(); // Remove the oldest city
  }

  recentCities.push(city); // Add the new city

  // Update the dropdown options
  // const dropdown = document.getElementById("recentCities");
  // Clear existing options

  const option = document.createElement("option");
  option.value = city;
  option.textContent = city;

  dropdown.appendChild(option);
}

function saveData() {
  localStorage.setItem("d", dropdown.innerHTML);
}

function showData() {
  dropdown.innerHTML = localStorage.getItem("d");
}
showData();
