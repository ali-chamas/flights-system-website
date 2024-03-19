const urlParams = new URLSearchParams(window.location.search);
const flightID = urlParams.get("id");
const airline = document.getElementById("airline-name");
const totalRating = document.getElementById("total-rating");
const listOfFlights = document.getElementById("available-flights");
const totalReviews = document.getElementById("reviews");

const getAirline = async () => {
    try {
        const response = await fetch("http://localhost/flights-system-website/server/airlines/airlinesApi.php?id=1", {
            method: "GET"
        });
        const responseData = await response.text();
        return responseData;

    } catch (error) {
        console.error(error);
        alert("Error occured while sending request");
    }
}






const app = async () => {
    const data = await getAirline();
    const airlineData = JSON.parse(data);
    const airlineName = airlineData.airline.name;
    const rating = airlineData.airline.rating;

    airline.innerHTML = airlineName;
    totalRating.innerHTML = rating;


}

app();