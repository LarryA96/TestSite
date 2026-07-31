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
    //Declare API formats
    const apiCall =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,is_day&timezone=UTC&temperature_unit=fahrenheit&precipitation_unit=inch`;
    const cityCall = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    //Call APIs
    Promise.all([
        fetch(cityCall).then(response => response.json()),
        fetch(apiCall).then(response => response.json())
    ])
    .then(([locationData, weatherData]) => {
        const location = [
            locationData.city,
            locationData.principalSubdivision
        ];

        const timeZone = locationData.localityInfo.informative.find(
            item => item.description === "time zone"
        )?.name;

        const languageCode = `en-${locationData.countryCode}`;

        console.log(location);
        console.log(timeZone);
        console.log(languageCode);

        const currentDate = new Date(weatherData.current.time);

        weatherDiv.innerHTML = `
            <h2>Forecast for: ${location[0]}, ${location[1]}</h2>
            <p><strong>Latitude:</strong> ${weatherData.latitude.toFixed(2)}</p>
            <p><strong>Longitude:</strong> ${weatherData.longitude.toFixed(2)}</p>
            <p><strong>Date:</strong> ${currentDate.toLocaleDateString(languageCode, { timeZone: timeZone })}, 
            ${currentDate.toLocaleTimeString(languageCode, { 
                timeZone: timeZone, 
                hour: "2-digit", 
                minute: "2-digit" 
            })}</p>
            <p><strong>Temperature:</strong> ${weatherData.current.temperature_2m} °F</p>
            <p><strong>Precipitation:</strong> ${weatherData.current.precipitation} in</p>
        `;
    })
    .catch(error => {
        weatherDiv.innerHTML = `<h1>Error: ${error.message}</h1>`;
    });
}
