var searchButton = document.getElementById("searchButton");
var searchBar = document.getElementById("searchBar");
var weatherInfo;

var getWeatherData = function (location) {
    // format the Open Weather api url                         User entered location             api key
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=07748c42b466d653378d277748838d7c";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    var currentWeather = data.weather[0].main;
                    weatherInfo = data;
                    console.log(currentWeather);
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

// function pushes 5 day forecast info into relevant elements

// function saves search to search history

searchButton.onclick = saveCity;