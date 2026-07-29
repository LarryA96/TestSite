// Create a new paragraph element
const paragraph = document.createElement("pre");

//Change its text to new york data
fetch('https://api.open-meteo.com/v1/forecast?latitude=40.73&longitude=-73.93')
  .then(response => response.json())
  .then(data => {
paragraph.textContent = JSON.stringify(data);
  });

// Add it to the end of the page
document.body.appendChild(paragraph);
