const apiKey = "511415362888f54ddd231fc82ca75e8e";
const iconUrl = 'http://openweathermap.org/img/wn/';
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Elementit joihin tiedot sijoitetaan
const tempSpan = document.getElementById('temperature');
const windSpeedSpan = document.getElementById('wind');
const descriptionSpan = document.getElementById('weather-description');
const iconImg = document.getElementById('weather-icon');
const locationSpan = document.getElementById('location-name');
const feelsLikeSpan = document.getElementById('feels-like');
const cloudsSpan = document.getElementById('clouds');
const visibilitySpan = document.getElementById('visibility');
const pressureSpan = document.getElementById('pressure');
const humiditySpan = document.getElementById('humidity');
const dewPointSpan = document.getElementById('dew-point');
const uviSpan = document.getElementById('uvi');
const rainSpan = document.getElementById('rain');
const snowSpan = document.getElementById('snow');
const sunriseSpan = document.getElementById('sunrise');
const sunsetSpan = document.getElementById('sunset');

const rainTimelineDiv = document.getElementById('precipitation-timeline'); // Lisätty elementti sademäärälle


// Sijaintiin perustuva sää
const getLocationWeather = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeatherData(position.coords.latitude, position.coords.longitude, null);
            getAirQuality(position.coords.latitude, position.coords.longitude);
        }, error => {
            alert(error.message);
        });
    } else {
        alert('Selaimesi ei tue sijaintia');
    }
};

// Kaupunkinimeen perustuva sää
const getCityWeather = (cityName) => {
    const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                getWeatherData(lat, lon, cityName);
                getAirQuality(lat, lon);
            } else {
                alert('Kaupunkia ei löydy.');
            }
        })
        .catch(error => {
            alert(error.message);
        });
};

// Yhteinen funktio säätietojen hakemiseen
const getWeatherData = (lat, lon, cityName) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data.current);
            displayHourlyForecast(data.hourly);
            displayDailyForecast(data.daily);
            displayMinutelyRain(data.minutely); // Lisätty funktio sademäärälle
            map.setView([lat, lon], 10);
            L.marker([lat, lon]).addTo(map);
            if (cityName) {
                locationSpan.textContent = cityName;
            } else {
                locationSpan.textContent = lat.toFixed(3) + ', ' + lon.toFixed(3);
            }
        })
        .catch(error => {
            alert(error.message);
        });
};

const getAirQuality = (lat, lon) => {
    const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayAirQuality(data.list[0].components);
        })
        .catch(error => {
            alert(error.message);
        });
};

const displayCurrentWeather = (data) => {
    tempSpan.textContent = data.temp + ' °C';
    feelsLikeSpan.textContent = data.feels_like ? data.feels_like + ' °C' : 'Ei saatavilla';
    windSpeedSpan.textContent = data.wind_speed + ' m/s';
    descriptionSpan.textContent = data.weather[0].description;
    iconImg.src = iconUrl + data.weather[0].icon + '@2x.png';
    cloudsSpan.textContent = data.clouds ? data.clouds + '%' : 'Ei saatavilla';
    visibilitySpan.textContent = data.visibility ? data.visibility / 1000 + ' km' : 'Ei saatavilla';
    pressureSpan.textContent = data.pressure ? data.pressure + ' hPa' : 'Ei saatavilla';
    humiditySpan.textContent = data.humidity ? data.humidity + '%' : 'Ei saatavilla';
    dewPointSpan.textContent = data.dew_point ? data.dew_point + ' °C' : 'Ei saatavilla';
    uviSpan.textContent = data.uvi ? data.uvi : 'Ei saatavilla';
    rainSpan.textContent = data.rain ? data.rain['1h'] + ' mm' : 'Ei saatavilla';
    snowSpan.textContent = data.snow ? data.snow['1h'] + ' mm' : 'Ei saatavilla';
    sunriseSpan.textContent = data.sunrise ? new Date(data.sunrise * 1000).toLocaleTimeString() : 'Ei saatavilla';
    sunsetSpan.textContent = data.sunset ? new Date(data.sunset * 1000).toLocaleTimeString() : 'Ei saatavilla';
};

const displayHourlyForecast = (hourly) => {
    // Toteuta tuntiennuste
};

const displayDailyForecast = (daily) => {
    // Toteuta 8 päivän ennuste
};

const displayAirQuality = (data) => {
    // Toteuta ilmanlaadun näyttäminen
};



//Sademääräennuste
const displayMinutelyRain = (minutely) => {
    rainTimelineDiv.innerHTML = ''; // Tyhjennä vanhat tiedot
    if (minutely && minutely.length > 0) {
        minutely.forEach(minute => {
            if (minute.precipitation > 0) {
                const time = new Date(minute.dt * 1000).toLocaleTimeString();
                const rain = minute.precipitation;
                const rainItem = document.createElement('p');
                rainItem.textContent = `${time}: ${rain} mm`;
                rainTimelineDiv.appendChild(rainItem);
            }
        });
    } else {
        rainTimelineDiv.textContent = 'Ei sadetta tunnin sisällä.';
    }
};

// Tapahtumakuuntelijat
document.getElementById('get-weather-button').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    getCityWeather(city);
});

getLocationWeather();