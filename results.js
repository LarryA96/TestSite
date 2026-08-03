const weatherDiv = document.getElementById("weather");

const searchType = sessionStorage.getItem("searchType");
const storedData = JSON.parse(sessionStorage.getItem("weatherSearch"));
console.log(JSON.stringify(storedData));

if (!storedData) {
    weatherDiv.textContent = "No search data found.";
} else if (searchType === "coordinates") {
    coordinateAPI(storedData.latitude, storedData.longitude);
    console.log(`Coordinates are ${storedData.latitude}, ${storedData.longitude}`);
} else if (searchType === "location") {
    locationAPI(storedData.location);
}

function coordinateAPI(latitude, longitude) {
    const cityCall =
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    const weatherCall =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,is_day&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto`;

    Promise.all([
        fetch(cityCall).then(r => r.json()),
        fetch(weatherCall).then(r => r.json())
    ])
    .then(([locationData, weatherData]) => {

        const city = locationData.city;
        const state = locationData.principalSubdivision;
        const languageCode = `en-${locationData.countryCode}`;

        const currentTime = new Date(weatherData.current.time);

        weatherDiv.innerHTML = `
            <h2>Forecast for: ${city}, ${state}</h2>
            <p><strong>Latitude:</strong> ${weatherData.latitude.toFixed(2)}</p>
            <p><strong>Longitude:</strong> ${weatherData.longitude.toFixed(2)}</p>
            <p><strong>Local Time:</strong> ${new Date().toLocaleTimeString(languageCode,{
                timeZone: weatherData.timezone,
                hour:"2-digit",
                minute:"2-digit"
            })}</p>
            <p><strong>Last Updated:</strong> ${currentTime.toLocaleDateString(languageCode)},
            ${currentTime.toLocaleTimeString(languageCode,{
                hour:"2-digit",
                minute:"2-digit"
            })}</p>
            <p><strong>Temperature:</strong> ${weatherData.current.temperature_2m} °F</p>
            <p><strong>Precipitation:</strong> ${weatherData.current.precipitation} in</p>
        `;
    })
    .catch(error => {
        weatherDiv.innerHTML = `<h1>Error: ${error.message}</h1>`;
    });
}

function locationAPI(location){
    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;

    fetch(url)
        .then(r => r.json())
        .then(data => {

            const place = data.results[0];

            coordinateAPI(
                place.latitude,
                place.longitude
            );

        });
}
