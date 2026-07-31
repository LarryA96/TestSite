const coordinatesForm = document.querySelector("#coordinatesForm");
const locationForm = document.querySelector("#locationForm");

// Search by coordinates
coordinatesForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const dataObject = Object.fromEntries(formData.entries());

    sessionStorage.setItem("searchType", "coordinates");
    sessionStorage.setItem("weatherSearch", JSON.stringify(dataObject));
console.log(JSON.stringify(dataObject));
    window.location.href = "results.html";
});

// Search by location
locationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const dataObject = Object.fromEntries(formData.entries());

    sessionStorage.setItem("searchType", "location");
    sessionStorage.setItem("weatherSearch", JSON.stringify(dataObject));

    window.location.href = "results.html";
});
