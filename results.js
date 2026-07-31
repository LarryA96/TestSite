const weatherDiv = document.getElementById("weather");

const searchType = sessionStorage.getItem("searchType");
const storedData = JSON.parse(sessionStorage.getItem("weatherSearch"));

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

    fetch(cityCall)
        .then(response => response.json())
        .then(locationData => {
            const city = locationData.city;
            const state = locationData.principalSubdivision;

            const timeZone = locationData.localityInfo.informative.find(
                item => item.description === "time zone"
            )?.name;

            const languageCode = `en-${locationData.countryCode}`;

            // Use returned values for weather API
            const apiCall =
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,is_day&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=${encodeURIComponent(timeZone)}`;

            return fetch(apiCall)
                .then(response => response.json())
                .then(weatherData => {
                    const currentTime = new Date(weatherData.current.time);

                    weatherDiv.innerHTML = `
                        <h2>Forecast for: ${city}, ${state}</h2>
                        <p><strong>Latitude:</strong> ${weatherData.latitude.toFixed(2)}</p>
                        <p><strong>Longitude:</strong> ${weatherData.longitude.toFixed(2)}</p>
                        <p><strong>Date:</strong> ${currentTime.toLocaleDateString(languageCode)}, 
                        ${currentTime.toLocaleTimeString(languageCode, {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}</p>
                        <p><strong>Temperature:</strong> ${weatherData.current.temperature_2m} °F</p>
                        <p><strong>Precipitation:</strong> ${weatherData.current.precipitation} in</p>
                    `;
                });
        })
        .catch(error => {
            weatherDiv.innerHTML = `<h1>Error: ${error.message}</h1>`;
        });
}
