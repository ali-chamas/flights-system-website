const urlParams = new URLSearchParams(window.location.search);
const flightID = urlParams.get("id");
const departureToDestination = document.getElementById("departure-to-destination");
const flight = {};

const getFlight = async () => {
    try {
        const response = await fetch("http://localhost/flights-system-website/server/flights/flightsApi.php?id=2", {
            method: "GET"
        });
        const responseData = await response.text();
        flight = responseData;

    } catch (error) {
        console.error(error);
        alert("Error occured while sending request");
    }
}
 console.log(flight);