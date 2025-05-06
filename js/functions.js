// ../js/functions.js WEATHER-APP

const apiKey = "511415362888f54ddd231fc82ca75e8e"; // Käytä vain tätä API-avainta
const iconUrl = 'http://openweathermap.org/img/wn/';

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeather(position.coords.latitude, position.coords.longitude);
            getHourlyForecast(position.coords.latitude, position.coords.longitude); // Lisätty tämä rivi
            document.getElementById('location').textContent = position.coords.latitude.toFixed(3) + ', ' + position.coords.longitude.toFixed(3);
        }, error => {
            alert(error.message);
        });
    } else {
        alert('Selaimesi ei tue sijaintia');
    }
};

const getWeather = (lat, lon) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('cityName').textContent = data.name;
            document.getElementById('temperature').textContent = data.main.temp + ' °C';
            document.getElementById('feels_like').textContent = data.main.feels_like + ' °C'; // Lisätty tämä rivi
            document.getElementById('wind-speed').textContent = data.wind.speed + ' m/s';
            document.getElementById('weather-description').textContent = data.weather[0].description;
            document.getElementById('weather-icon').src = iconUrl + data.weather[0].icon + '@2x.png';

            document.getElementById('clouds').textContent = data.clouds.all;
            document.getElementById('visibility').textContent = (data.visibility / 1000).toFixed(1); // Muutetaan metreistä kilometreiksi ja pyöristetään yhteen desimaaliin
            document.getElementById('pressure').textContent = data.main.pressure;
            document.getElementById('humidity').textContent = data.main.humidity;
            document.getElementById('dew-point').textContent = data.main.dew_point ? data.main.dew_point.toFixed(1) : '-'; // API ei välttämättä aina palauta
            document.getElementById('uvi').textContent = data.uvi ? data.uvi : '-'; // UV-indeksi ei ole suoraan perussäädatassa

            document.getElementById('rain').textContent = data.rain ? data['rain']['1h'] : '0'; // Sade viimeisen tunnin aikana
            document.getElementById('snow').textContent = data.snow ? data['snow']['1h'] : '0'; // Lumi viimeisen tunnin aikana

            const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            document.getElementById('sunrise').textContent = sunriseTime;
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            document.getElementById('sunset').textContent = sunsetTime;
        })
        .catch(error => {
            alert(error.message);
        });
};

const getHourlyForecast = (lat, lon) => {
  const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(hourlyForecastUrl)
      .then(response => response.json())
      .then(data => {
          displayHourlyForecast(data.list); // Lähetetään ennustelista näyttämisfunktiolle
      })
      .catch(error => {
          console.error("Virhe tuntiennustietojen haussa:", error);
      });
};

const displayHourlyForecast = (forecastList) => {
  const hourlyForecastListDiv = document.getElementById('hourly-forecast-list');
  hourlyForecastListDiv.innerHTML = ''; // Tyhjennetään edellinen sisältö

  // Käydään läpi ennustelista (esim. seuraavat 8 tuntia)
  for (let i = 0; i < 8 && i < forecastList.length; i++) {
      const forecast = forecastList[i];
      const time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const temperature = forecast.main.temp.toFixed(1);
      const iconCode = forecast.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

      const hourlyItem = document.createElement('div');
      hourlyItem.classList.add('hourly-item');
      hourlyItem.innerHTML = `
          <p>${time}</p>
          <img src="${iconUrl}" alt="Sääkuvake">
          <p>${temperature} °C</p>
      `;
      hourlyForecastListDiv.appendChild(hourlyItem);
  }
};

getLocation();












//alkup
/*
const url = 'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={4f3cff9e58045f27d44b4ebe192d3540}';
const icon_url = 'http://openweathermap.org/img/wn/';
const api_key = "4f3cff9e58045f27d44b4ebe192d3540";
//const api_key = '4f3cff9e58045f27d44b4ebe192d3540';


const temp_span = document.querySelector('#temp')
const wind_speed_span = document.querySelector('#speed')
const direction_span = document.querySelector('#direction')
const description_span = document.querySelector('#description')
const icon_img = document.querySelector('img')
const lat_span = document.querySelector('#lat'); // Lisätty elementit sijainnille
const lng_span = document.querySelector('#lng');
const cityName_span = document.querySelector('#cityName'); // Käytä oikeaa ID:tä index.html:stä
const feels_like_span = document.querySelector('#feels_like');


/*
const apiKey = "511415362888f54ddd231fc82ca75e8e"; // Käytä vain tätä API-avainta
const iconUrl = 'http://openweathermap.org/img/wn/';

  const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeather(position.coords.latitude, position.coords.longitude);
            document.getElementById('location').textContent = position.coords.latitude.toFixed(3) + ', ' + position.coords.longitude.toFixed(3);
        }, error => {
            alert(error.message);
        });
    } else {
        alert('Selaimesi ei tue sijaintia');
    }
};


const getWeather = (lat, lon) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          document.getElementById('cityName').textContent = data.name;
          document.getElementById('temperature').textContent = data.main.temp + ' °C';
          document.getElementById('wind-speed').textContent = data.wind.speed + ' m/s';
          document.getElementById('weather-description').textContent = data.weather[0].description;
          document.getElementById('weather-icon').src = iconUrl + data.weather[0].icon + '@2x.png';

          //lisäykset
          document.getElementById('feels_like').textContent = data.weather[0].description;
      })
      .catch(error => {
          alert(error.message);
      });
};

getLocation();
*/


/*
 
const getLocation = () => 
 {
  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(position => 
      {
        document.querySelector('#lat').innerHTML = position.coords.latitude.toFixed(3) + ', '
        document.querySelector('#lng').innerHTML = position.coords.longitude.toFixed(3)
      } ),(error =>
        {
          alert(error)
        })
  } 
  else 
  {
    alert("Selaimesi ei tue sijaintia")
  }
}

const getWeather = (lat, lon) => 
 {
  const address = url +
  'lat=' + lat +
  '&lon=' + lon +
  '&units=metric' +
  '&appid=' + api_key
  axios.get(address)
    .then(response =>
      {
        const json = response.data
        temp_span.innerHTML = json.current.temp + '&#8451;'
        wind_speed_span.innerHTML = json.wind.speed + 'm/s'
        direction_span.innerHTML = json.wind.deg + '&#176;'
        description_span.innerHTML = json.weather[0].decription
        const image = icon_url + json.weather[0].icon + '@2x.png'
        icon_img.src=image

        //lisäykset
        feels_like_span.innerHTML = json.current.feels_like + '&#8451;'

      })
    .catch(error =>
      {
        alert(error)
      })
 }

  getLocation()
  



*/