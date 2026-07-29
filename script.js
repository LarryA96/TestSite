const weatherDiv = document.getElementById("weather");

fetch("https://api.open-meteo.com/v1/forecast?latitude=40.73&longitude=-73.93&hourly=temperature_2m")
  .then(response => response.json())
  .then(data => {
    weatherDiv.innerHTML = `
      <h2>Forecast</h2>
      <p><strong>Latitude:</strong> ${data.latitude}</p>
      <p><strong>Longitude:</strong> ${data.longitude}</p>
      <p><strong>Time:</strong> ${data.hourly.time[6]}</p>
      <p><strong>Temperature:</strong> ${data.hourly.temperature_2m[0]}${data.hourly_units.temperature_2m}</p>
    `;
  })
  .catch(error => {
    weatherDiv.textContent = `Error: ${error.message}`;
  });
