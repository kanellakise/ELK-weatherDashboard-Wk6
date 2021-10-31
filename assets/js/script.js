var searchButton = document.getElementById("searchButton");
var searchBar = document.getElementById("searchBar");
var searchedLocation;

// this function gets the coordinates of the searched location
function getWeatherData (location) {
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

                    getAdditionalData(lat, lon)

                    console.log(data);
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
function getAdditionalData (lat, lon) {
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
                    console.log(data);
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

    searchBar.value = "";
};

// listens for button click
function saveCity(event) {
    event.preventDefault();
    userCity();
};

//

// function pushes current weather info into relevant elements
function applyCurrentWeather(weather) {
    var temp = document.getElementById("temp");
    var humidity = document.getElementById("humidity");
    var wind = document.getElementById("wind");
    var uv = document.getElementById("uv");
    var date = document.getElementById("currentDate")
    var currentWeather = weather.current;

    date.textContent = searchedLocation;
    temp.textContent = currentWeather.temp + "F";
    humidity.textContent = currentWeather.humidity + "%";
    wind.textContent = currentWeather.wind_speed + "mph";
    uv.textContent = currentWeather.uvi;

};

// function sets uvi warning 

// function pushes 5 day forecast info into relevant elements
function fiveDays (weather) {

    for (var i = 1; i <= 5; i++) {
        var targetDayTemp = "temp" + i;
        var targetDayHumidity = "humidity" + i;
        var targetDayWind = "wind" + i;
        var select = i - 1;
        
        var temp = document.getElementById(targetDayTemp);
        var humidity = document.getElementById(targetDayHumidity);
        var wind = document.getElementById(targetDayWind);

        temp.textContent = weather.daily[select].temp.day + "F";
        humidity.textContent = weather.daily[select].humidity + "%";
        wind.textContent = weather.daily[select].wind_speed = "mph";
    }
};

// function saves search to search history

searchButton.onclick = saveCity;