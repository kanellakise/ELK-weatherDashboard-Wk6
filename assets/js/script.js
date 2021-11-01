var searchButton = document.getElementById("searchButton");
var searchBar = document.getElementById("searchBar");
var searchedLocation;
var DateTime = luxon.DateTime;
var searched;

// this function gets the coordinates of the searched location
function getWeatherData(location) {
    // format the Open Weather api url                         User entered location             api key
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=07748c42b466d653378d277748838d7c";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    searchedLocation = data.name;

                    getAdditionalData(lat, lon);
                });
            } else {
                // request was unsuccessful 
                alert("Error: weather info not found");
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Open Weather");
        });
};

// this function gets the desired information from the searched location, using coordinates
function getAdditionalData(lat, lon) {
    // format the Open Weather api url                         User entered location             api key
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=07748c42b466d653378d277748838d7c";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    applyCurrentWeather(data);
                    fiveDays(data);
                });
            } else {
                // request was unsuccessful 
                alert("Error: weather info not found");
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Open Weather");
        });
};

// pulls weather info to be accessed later
function userCity() {
    var finalSearch = searchBar.value;
    getWeatherData(finalSearch);

    //TODO: call function that saves search history, using finalSearch
    saveSearch();
    loadSearch();
    searchBar.value = "";
};

// listens for button click
function saveCity(event) {
    event.preventDefault();
    userCity();

};

// saves searched locations to local storage
function saveSearch() {
    searched = searchBar.value.trim();

    localStorage.setItem("searched", JSON.stringify(searched));
};

function loadSearch() {
    searched = JSON.parse(localStorage.getItem("searched"));

    console.log(searched);
};

// function pushes current weather info into relevant elements
function applyCurrentWeather(weather) {
    var temp = document.getElementById("temp");
    var humidity = document.getElementById("humidity");
    var wind = document.getElementById("wind");
    var uv = document.getElementById("uv");
    var date = document.getElementById("currentDate")
    var currentWeather = weather.current;
    var currentDateMilli = weather.current.dt;

    date.textContent = searchedLocation + " " + calculateDate(currentDateMilli);
    temp.textContent = currentWeather.temp + "F";
    humidity.textContent = currentWeather.humidity + "%";
    wind.textContent = currentWeather.wind_speed + "mph";
    uv.textContent = currentWeather.uvi;

};

// function sets uvi warning status

// function pushes 5 day forecast info into relevant elements
function fiveDays(weather) {

    for (var i = 1; i <= 5; i++) {
        var targetDayTemp = "temp" + i;
        var targetDayHumidity = "humidity" + i;
        var targetDayWind = "wind" + i;
        var targetDayDate = "forecastDate" + i;
        var targetDayIcon = "icon" + i;
        var dateMilliseconds = weather.daily[i].dt;
        var iconCode = weather.daily[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

        var icon = document.getElementById(targetDayIcon);
        var date = document.getElementById(targetDayDate);
        var temp = document.getElementById(targetDayTemp);
        var humidity = document.getElementById(targetDayHumidity);
        var wind = document.getElementById(targetDayWind);

        icon.setAttribute("src", iconUrl);
        date.textContent = calculateDate(dateMilliseconds);
        temp.textContent = weather.daily[i].temp.day + "F";
        humidity.textContent = weather.daily[i].humidity + "%";
        wind.textContent = weather.daily[i].wind_speed + "mph";
        console.log(iconUrl);
        console.log(icon);
    }
};

function calculateDate(milli) {
    var date = DateTime.fromMillis(milli * 1000).toLocaleString();
    return date;
};

// grabs current weather image

searchButton.onclick = saveCity;