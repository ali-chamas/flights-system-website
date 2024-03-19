const urlParams = new URLSearchParams(window.location.search);
const flightID = urlParams.get("id");
const departureToDestination = document.getElementById("departure-to-destination");
const totalRating = document.getElementById("total-rating");
const availableTickets = document.getElementById("available-tickets");
const totalReviews = document.getElementById("reviews");

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

const getTickets = async () => {
    try {
        const response = await fetch("http://localhost/flights-system-website/server/tickets/view.php?id=2", {
            method: "GET"
        });
        const responseData = await response.text();
        return responseData;

    } catch (error) {
        console.error(error);
        alert("Error occured while sending request");
    }
}

const getReviews = async () => {
    try {
        const response = await fetch("http://localhost/flights-system-website/server/reviews/view-flights-reviews.php", {
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
    const depatureTime = flight.flight.departureTime;
    const arrivalTime = flight.flight.arrivalTime;
    const rating = flight.flight.rating;
    
    const ticketData = await getTickets();
    const tickets = JSON.parse(ticketData);

    availableTickets.innerHTML="";
    for (let i=0; i<tickets.allTickets.length; i++) {
        const date = tickets.allTickets[i].date;
        const price = tickets.allTickets[i].price;
        const totalSeats = tickets.allTickets[i].totalSeats;

        availableTickets.innerHTML= `Date ${date} Price ${price} Total seats ${totalSeats}`;
    }

    const reviewsData = await getReviews();
    const reviews = JSON.parse(reviewsData);

    totalReviews.innerHTML="";
    for (let i=0; i<reviews.reviews.length; i++) {
        const rating = reviews.reviews[i].rating;
        const review = reviews.reviews[i].review;
        const createdAT = reviews.reviews[i].createdAT;
        const username = reviews.reviews[i].userName;

        totalReviews.innerHTML += `${username} ${review} ${rating} created at ${createdAT} </br>`;
    }

    departureToDestination.innerHTML= `<h2>${departure} to ${destination}</h2> </br> Departure time ${depatureTime} </br> Arrival time ${arrivalTime}`;
    totalRating.innerHTML= rating;
}

app();