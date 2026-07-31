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
    let location;
    let timeZone;
    let languageCode;
    const apiCall =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,is_day&temperature_unit=fahrenheit&precipitation_unit=inch`;
    const cityCall = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    //Get name of city,state and store for display
    fetch(cityCall)
        .then(response => response.json())
        .then(data => {
            location = [data.city, data.principalSubdivision];
            timeZone = data.localityInfo.informative.find(
  item => item.description === "time zone"
)?.name;
            languageCode = `en-${data.countryCode}`;
            console.log(location);
            console.log(timezone);
            console.log(languageCode);
        })
        .catch(error => {
            console.log(error.message);
        });

    //Call for weather data and update html page
    fetch(apiCall)
        .then(response => response.json())
        .then(data => {
            weatherDiv.innerHTML = `
                <h2>Forecast for: ${location[0]}, ${location[1]}</h2>
                <p><strong>Latitude:</strong> ${data.latitude.toFixed(2)}</p>
                <p><strong>Longitude:</strong> ${data.longitude.toFixed(2)}</p>
                <p><strong>Date:</strong> ${new Date(data.current.time).toDateString()}, ${new Date(data.current.time).toLocaleTimeString(languageCode, {timeZone: timeZone, hour: "2-digit", minute: "2-digit"})}</p>
                <p><strong>Temperature:</strong> ${data.current.temperature_2m} °F</p>
                <p><strong>Precipitation:</strong> ${data.current.precipitation} in</p>
            `;
        })
        .catch(error => {
            weatherDiv.innerHTML = `<h1>Error: ${error.message}</h1>`;
        });
}
