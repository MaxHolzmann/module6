// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//664aa0ecdb360272ae3da2581583e2c7
let searchValue = document.getElementById('search-value')
let searchButton = document.getElementById('search-btn');

let currentCityEl = document.getElementById('current-city')
let currentDateEl = document.getElementById('current-date')
let currentTempEl = document.getElementById('current-temp')
let currentWindEl = document.getElementById('current-wind')
let currentHumidEl = document.getElementById('current-humid')

let searchHistory = document.getElementById('history');

let fiveDayEl = document.getElementById('five-day')
let fiveDayTitle = document.getElementById('five-day-title');

let cityName;
let cityNameInfo;
/* 
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/


searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    fetchCityName();
});

const fetchCityName = (city) => {
        if(!city) {
            city = searchValue.value;
        }
        fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city +'&units=imperial&limit=5&appid=664aa0ecdb360272ae3da2581583e2c7')
        .then((response) => response.json())
        .then((data) => {
            getWeatherData(getCityLat(data), getCityLong(data));
            getFiveDayData(getCityLat(data), getCityLong(data));
        })
        .catch((err) => {
            console.log('Error')
        })
}

const getCityLat = (data) => {
    return data[0].lat;
}

const getCityLong = (data) => {
    return data[0].lon;
}

const getWeatherData = (lat, long) => {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&units=imperial&appid=664aa0ecdb360272ae3da2581583e2c7')
    .then((response) => response.json())
    .then((data) => {
        displayCurrentWeather(data.name, data.main.temp, data.wind.speed, data.main.humidity);
    });
}

const getFiveDayData = (lat, long) => {
    fiveDayEl.innerHTML = "";
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&units=imperial&appid=664aa0ecdb360272ae3da2581583e2c7')
    .then((response) => response.json())
    .then((data) => {
        for(let i = 1; i < data.list.length; i+= 8) {
            displayFiveDayData(
                data.list[i].dt_txt,
                data.list[i].main.temp,
                data.list[i].wind.speed,
                data.list[i].main.humidity
            );
        }
    });
}

const displayFiveDayData = (date, temp, wind, humid, icon) => {
    let newDay = document.createElement('div');
    newDay.append(document.createElement('ul'));
    newDay.classList.add('five-day-card');

    let dateLi = document.createElement('li');
    dateLi.textContent = fixDate(date);

    let tempLi = document.createElement('li');
    tempLi.textContent = temp + "° F";

    let windLi = document.createElement('li');
    windLi.textContent = wind + " mph winds";

    let humidLi = document.createElement('li');
    humidLi.textContent = humid + "% Humidity";



    newDay.append(dateLi);
    newDay.append(tempLi);
    newDay.append(windLi);
    newDay.append(humidLi);

    fiveDayEl.append(newDay);


}

const fixDate = (date) => {
    let day;
    let month;
    let year;
    date = date.slice(0,10)
    date = date.split('-')
    year = date[0];
    month = date[1];
    day = date[2];

    return month + '/' + day + '/' + year;
}

const displayCurrentWeather = (name, temp, wind, humidity, date) => {
    currentCityEl.textContent = name;
    currentTempEl.textContent = temp + "° F";
    currentWindEl.textContent = wind + " mph winds";
    currentHumidEl.textContent = humidity + "% Humidity";
    fiveDayTitle.textContent = "Five Day Weather Report";

    //if statement to check for local storage
    for(let i = 0; i < localStorage.length; i++) {
        if(localStorage.getItem(i) === name) {
            return;
        } 
    }

    createNewButton(name);
    localStorage.setItem(localStorage.length, name) 

}

const createNewButton = (name) => {
    let newSearchHistory = document.createElement('button');
    newSearchHistory.textContent = name;
    newSearchHistory.id = 'search-history-btn'
    searchHistory.appendChild(newSearchHistory);
}

const displayLocalStorage = () => {
    for(let i = 0; i < localStorage.length; i++) {
        createNewButton(localStorage.getItem(i));
    }
}

displayLocalStorage();

document.addEventListener('click', (e) => {
    if(e.target.id == 'search-history-btn') {
       fetchCityName(e.target.textContent);
    }
})







