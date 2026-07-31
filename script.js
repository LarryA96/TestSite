//Create event listeners for form
//Select the form element
const coordinatesForm = document.querySelector('#coordinatesForm');
const locationForm = document.querySelector('#locationForm')

//Listen for the submit events
coordinatesForm.addEventListener('submit', function (event) {
  // Prevent the default browser page reload
  event.preventDefault();

  //extract all data from the form
  const formData = new FormData(form);

  //Extract data into a standard JavaScript object
  const dataObject = Object.fromEntries(formData.entries());
});

locationForm.addEventListener('submit', function (event) {
  // Prevent the default browser page reload
  event.preventDefault();

  //extract all data from the form
  const formData = new FormData(form);

  //Extract data into a standard JavaScript object
  const dataObject = Object.fromEntries(formData.entries());
});

//Check if location or coordinates was provided
if (dataObject.location){
  locationAPI(dataObject.location);
}
if (dataObject.latitude){
  coordinateAPI(dataObject.latitude, dataObject.longitude);
}



const weatherDiv = document.getElementById("weather");

//Handle API call
function coordinateAPI(latitude, longitude){
  const weatherDiv = document.getElementById("weather");
  const apiCall = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,is_day&temperature_unit=fahrenheit&precipitation_unit=inch`;
fetch(apiCall)
  .then(response => response.json())
  .then(data => {
    //Redirect page
    window.location.href = "https://larrya96.github.io/TestSite/results.html";
    //Update contents with api data
    weatherDiv.innerHTML = `
      <h2>Forecast</h2>
      <p><strong>Latitude:</strong> ${data.latitude}</p>
      <p><strong>Longitude:</strong> ${data.longitude}</p>
      <p><strong>Time:</strong> ${data.current.time}</p>
      <p><strong>Temperature:</strong> ${data.current.temperature_2m}</p>
      <p><strong>Precipitation:</strong> ${data.current.precipitation}</p>
      <p>testing: form data = ${JSON.stringify(dataObject)}</p>
    `;
  })
  .catch(error => {
    weatherDiv.textContent = `Error: ${error.message}`;
  });
}

function locationAPI(location){
}
