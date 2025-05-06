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

//const getWeather = (lat, lon) => {
  const getWeather = async (lat, lon) => {
    try {
        const apiKey = '511415362888f54ddd231fc82ca75e8e'; // Säilytä API-avaimesi
        const unit = localStorage.getItem('temperatureUnit') || 'metric'; // Hae yksikkö localStorage:sta, oletus Celsius
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}&lang=fi`; // Lisätty &lang=fi

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const weatherIcon = data.weather[0].icon;
            const windSpeed = data.wind.speed;
            const windDirection = data.wind.deg;
            const humidity = data.main.humidity;
            const rain = data.rain ? data.rain['1h'] || data.rain['3h'] / 3 : 0; // Käytetään 1h jos saatavilla, muuten jaetaan 3h kolmella
            const snow = data.snow ? data.snow['1h'] || data.snow['3h'] / 3 : 0; // Kuten sateelle

            // Muunnetaan tuulen nopeus km/h, jos yksikkö on Celsius
            const windSpeedKmH = unit === 'metric' ? windSpeed * 3.6 : windSpeed;

            // Valitaan oikea yksikkö merkkijono
            const unitSymbol = unit === 'metric' ? '°C' : '°F';

            document.getElementById('temperature').textContent = `${temperature.toFixed(1)} ${unitSymbol}`;
            document.getElementById('feels_like').textContent = `${data.main.feels_like.toFixed(1)} ${unitSymbol}`; // Myös tuntuu kuin -lämpötila
            document.getElementById('weather-description').textContent = description;
            document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${weatherIcon.replace('n', 'd')}@2x.png`; // Korjattu kuvakkeen URL
            document.getElementById('wind-speed').textContent = `Tuuli: ${windSpeedKmH.toFixed(1)} km/h`;
            document.getElementById('wind-direction').textContent = `(${getWindDirectionText(windDirection)})`;
            document.getElementById('humidity').textContent = `Kosteus: ${humidity}%`;
            document.getElementById('rain').textContent = `Sade: ${rain.toFixed(1)} mm/h`;
            document.getElementById('snow').textContent = `Lumi: ${snow.toFixed(1)} mm/h`;

            // Päivitetään myös tuntiennuste oikealla yksiköllä
            getHourlyForecast(latitude, longitude, unit);
            // Päivitetään myös viikkoennuste oikealla yksiköllä
            getDailyForecast(latitude, longitude, unit);

        } else {
            console.error('Säätietojen haku epäonnistui:', data.message);
            updateUIForError();
        }
    } catch (error) {
        console.error('Virhe säätietojen haussa:', error);
        updateUIForError();
    }
};

const getHourlyForecast = (lat, lon, unit = 'metric') => {
  const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}&lang=fi`;
  fetch(hourlyForecastUrl)
      .then(response => response.json())
      .then(data => {
          displayHourlyForecast(data.list, unit); // Lähetetään yksikkö näyttämisfunktiolle
      })
      .catch(error => {
          console.error("Virhe tuntiennustietojen haussa:", error);
      });
};

const displayHourlyForecast = (forecastList, unit = 'metric') => {
  const hourlyForecastListDiv = document.getElementById('hourly-forecast-list');
  hourlyForecastListDiv.innerHTML = ''; // Tyhjennetään edellinen sisältö
  const unitSymbol = unit === 'metric' ? '°C' : '°F';

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
          <p>${temperature} ${unitSymbol}</p>
      `;
      hourlyForecastListDiv.appendChild(hourlyItem);
  }
};


const getDailyForecast = (lat, lon, unit = 'metric') => {
  const dailyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}&lang=fi`;
  fetch(dailyForecastUrl)
      .then(response => response.json())
      .then(data => {
          displayDailyForecast(data.list, unit); // Lähetetään yksikkö näyttämisfunktiolle
      })
      .catch(error => {
          console.error("Virhe viikkoennustietojen haussa:", error);
      });
};

const displayDailyForecast = (forecastList, unit = 'metric') => {
  const dailyForecastListDiv = document.getElementById('daily-forecast-list');
  dailyForecastListDiv.innerHTML = ''; // Tyhjennetään edellinen sisältö
  const dailyData = {}; // Objekti päivittäisten ennusteiden tallentamiseen
  const unitSymbol = unit === 'metric' ? '°C' : '°F';

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
          <p>${forecast.temperature} ${unitSymbol}</p>
      `;
      dailyForecastListDiv.appendChild(dailyItem);
  }
};

getLocation();

