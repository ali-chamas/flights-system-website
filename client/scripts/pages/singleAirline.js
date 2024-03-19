const urlParams = new URLSearchParams(window.location.search);
const flightID = urlParams.get("id");
const airline = document.getElementById("airline");
const totalRating = document.getElementById("total-rating");
const listOfFlights = document.getElementById("available-flights");
const totalReviews = document.getElementById("reviews");

const getAirline = async () => {
    try {
        const response = await fetch("http://localhost/flights-system-website/server/flights/flightsApi.php?id=2", {
            method: "GET"
        });
        const responseData = await response.text();
        return responseData;

    } catch (error) {
        console.error(error);
        alert("Error occured while sending request");
    }
}