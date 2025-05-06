// ../js/functions.js WEATHER-APP

const apiKey = "511415362888f54ddd231fc82ca75e8e"; // Käytä vain tätä API-avainta
const iconUrl = 'http://openweathermap.org/img/wn/';

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeather(position.coords.latitude, position.coords.longitude);
            getHourlyForecast(position.coords.latitude, position.coords.longitude); // Lisätty tämä rivi
            getDailyForecast(position.coords.latitude, position.coords.longitude); // Lisätty tämä rivi
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


const getDailyForecast = (lat, lon) => {
  const dailyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(dailyForecastUrl)
      .then(response => response.json())
      .then(data => {
          displayDailyForecast(data.list); // Lähetetään ennustelista näyttämisfunktiolle
      })
      .catch(error => {
          console.error("Virhe viikkoennustietojen haussa:", error);
      });
};

const displayDailyForecast = (forecastList) => {
  const dailyForecastListDiv = document.getElementById('daily-forecast-list');
  dailyForecastListDiv.innerHTML = ''; // Tyhjennetään edellinen sisältö

  const dailyData = {}; // Objekti päivittäisten ennusteiden tallentamiseen

  forecastList.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString([], { weekday: 'short' }); // Lyhyt päivän nimi
      const hour = date.getHours();

      // Tallennetaan keskipäivän (klo 12) ennuste kullekin päivälle
      if (hour >= 11 && hour <= 13) {
          if (!dailyData[day]) {
              dailyData[day] = {
                  temperature: forecast.main.temp.toFixed(1),
                  icon: forecast.weather[0].icon
              };
          }
      }
      // Jos keskipäivän dataa ei löydy, otetaan ensimmäinen ennuste päivältä
      else if (!dailyData[day]) {
          dailyData[day] = {
              temperature: forecast.main.temp.toFixed(1),
              icon: forecast.weather[0].icon
          };
      }
  });

  // Luodaan HTML-elementit päivittäisille ennusteille
  for (const day in dailyData) {
      const forecast = dailyData[day];
      const iconUrl = `http://openweathermap.org/img/wn/${forecast.icon}@2x.png`;

      const dailyItem = document.createElement('div');
      dailyItem.classList.add('daily-item');
      dailyItem.innerHTML = `
          <p>${day}</p>
          <img src="${iconUrl}" alt="Sääkuvake">
          <p>${forecast.temperature} °C</p>
      `;
      dailyForecastListDiv.appendChild(dailyItem);
  }
};

getLocation();

