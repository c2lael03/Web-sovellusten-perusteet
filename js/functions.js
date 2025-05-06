// ../js/functions.js
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
      })
    .catch(error =>
      {
        alert(error)
      })
 }

  getLocation()