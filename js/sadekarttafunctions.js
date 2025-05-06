// ../js/sadekarttafunctions.js WEATHER-APP

const apiKey = "511415362888f54ddd231fc82ca75e8e"; // Käytä vain tätä API-avainta
const iconUrl = 'http://openweathermap.org/img/wn/';

const getLocation = () => {
    console.log('getLocation kutsuttu');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getHourlyForecast(position.coords.latitude, position.coords.longitude); // Lisätty tämä rivi
        }, error => {
            alert(error.message);
        });
    } else {
        alert('Selaimesi ei tue sijaintia');
    }
};

const getHourlyForecast = (lat, lon) => {
    console.log('getHourlyForecast kutsuttu lat:', lat, 'lon:', lon);
    const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;    fetch(hourlyForecastUrl)
    fetch(hourlyForecastUrl)
        .then(response => response.json())
        .then(data => {
            displayRainChart(data.list);
        })
        .catch(error => {
            console.error("Virhe tuntiennustietojen haussa:", error);
        });
};

const displayRainChart = (forecastList) => {
    console.log('displayRainChart kutsuttu', forecastList);
    const rainChartCanvas = document.getElementById('rainChart');
    if (!rainChartCanvas) {
        console.error("Canvas-elementtiä 'rainChart' ei löydy.");
        return;
    }
    const ctx = rainChartCanvas.getContext('2d');

    const hourlyRainData = {
        labels: [],
        datasets: [{
            label: 'Sademäärä (mm)',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    for (let i = 0; i < 8; i++) { // Näytetään esimerkiksi 8 tunnin ennuste
        const forecast = forecastList[i * 3];
        if (forecast) {
            const date = new Date(forecast.dt * 1000);
            const hours = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            hourlyRainData.labels.push(hours);
            const rainAmount = forecast.rain ? (forecast.rain['1h'] !== undefined ? forecast.rain['1h'] : forecast.rain['3h'] / 3 || 0) : 0; // Käytetään 1h jos saatavilla, muuten jaetaan 3            hourlyRainData.datasets[0].data.push(forecast.rain ? forecast.rain['3h'] || 0 : 0);
            hourlyRainData.datasets[0].data.push(rainAmount);
            console.log('Aika:', hours, 'Sademäärä (mm/h):', rainAmount); 
        }
    }

    console.log('hourlyRainData:', hourlyRainData); 

    new Chart(ctx, {
        type: 'bar',
        data: hourlyRainData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Sademäärä (mm/h)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Aika'
                    }
                }
            },
            responsive: true,
            //maintainAspectRatio: false
        }
    });
};

// Hae sijainti ja aloita datan haku
getLocation();