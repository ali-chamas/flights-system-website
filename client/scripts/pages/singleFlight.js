const urlParams = new URLSearchParams(window.location.search);
const flightID = urlParams.get("id");
const departureToDestination = document.getElementById("departure-to-destination");
const totalRating = document.getElementById("total-rating");

const getFlight = async () => {
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


const app = async () =>{
    const data = await getFlight();
    const flight = JSON.parse(data);
    const destination = flight.flight.destination;
    const departure = flight.flight.departure;
    const rating = flight.flight.rating;
    departureToDestination.innerHTML= `${departure} to ${destination}`;
    totalRating.innerHTML= rating;
}

app();