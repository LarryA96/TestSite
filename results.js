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
    const apiCall =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,is_day&temperature_unit=fahrenheit&precipitation_unit=inch`;
    console.log(`api call is "${apiCall}"`);

    fetch(apiCall)
        .then(response => response.json())
        .then(data => {
            weatherDiv.innerHTML = `
                <h2>Forecast</h2>
                <p><strong>Latitude:</strong> ${data.latitude.toFixed(2)}</p>
                <p><strong>Longitude:</strong> ${data.longitude.toFixed(2)}</p>
                <p><strong>Time:</strong> ${new Date(data.current.time).toDateString()}</p>
                <p><strong>Temperature:</strong> ${data.current.temperature_2m} °F</p>
                <p><strong>Precipitation:</strong> ${data.current.precipitation} in</p>
            `;
        })
        .catch(error => {
            weatherDiv.innerHTML = `<h1>Error: ${error.message}</h1>`;
        });
}
