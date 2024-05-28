const apiKey = "f36eb96f5ca179c60031979a9d6197f0";
const searchInput = document.getElementById("city-search");
const searchButton = document.getElementById("search-btn");
const locationButton = document.getElementById("location-btn");
const weatherDisplay = document.getElementById("weather-display");
const dropdown = document.getElementById("recentCities");
const fiveDayDiv = document.getElementById("5-Day-Forecast");
const heading5 = document.getElementById("5dayheading");
const err = document.getElementById("error");
const recentCities = [];
localStorage.clear();

//fetches and return data asynchronously
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

//displays current weather
function displayWeather(data) {
  if (!data || !data.city) {
    displayError("Invalid/Empty location");
    return;
  }
  addRecentCity(data.city.name);
  //adds recent cities to the <select> element

  saveData();
  //Saves the <select> element state to local storage

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

//displays all error message
function displayError(message) {
  err.classList.remove("hidden");
  err.textContent = `${message}`;
  fiveDayDiv.classList.add("hidden");
  weatherDisplay.classList.add("hidden");
}

// displays 5 day forecast
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

//callbacks for Geolocation api ==>success fetches position and latitude and longitude to the url
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

// callback for geolocation api ==>failure returns a error message to display
const failed = (error) => {
  displayError(error.message);
};

//triggers fetching and displaying of data when recent city is selected
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

// add recently searched city into the list and is called whenever "search" or "geolocation " is clicked
function addRecentCity(city) {
  if (recentCities.includes(city)) return;

  recentCities.push(city);
  const option = document.createElement("option");
  option.value = city;
  option.textContent = city;

  dropdown.appendChild(option);
}

// triggered when search button is clicked and async function fetchweather() is called for fetching data from api and data is passed to be displayed in displayWeather()
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

// triggered when location button is clicked then GPS coordinates are fetched from geolocation api and that data is passed to async function fetchweather() for fetching data from api and data is passed to be displayed in displayWeather()

locationButton.addEventListener("click", () => {
  //geolocation api call which take two callbacks defined above
  navigator.geolocation.getCurrentPosition(success, failed);
});

//display data of the recent city when the recent city is selected via the same process as mentioned above
dropdown.addEventListener("change", onRecentCityClick);

//for storing recent cities
function saveData() {
  localStorage.setItem("d", dropdown.innerHTML);
}

//for displaying recent cities
function showData() {
  dropdown.innerHTML = localStorage.getItem("d");
}
showData();
