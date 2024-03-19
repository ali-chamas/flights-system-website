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

//make a function to get all the flights but i want all the flights with a specific airlineID


const getReviews = async () => {
    try {
        const response = await fetch("http://localhost/flights-system-website/server/reviews/view-airlines-reviews.php", {
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

    //display flights with certain airlineID 

    const reviewsData = await getReviews();
    const reviews = JSON.parse(reviewsData);

    totalReviews.innerHTML="";
    for (let i=0; i<reviews.reviews.length; i++) {
        const rating = reviews.reviews[i].rating;
        const review = reviews.reviews[i].review;
        const createdAT = reviews.reviews[i].createdAT;
        const username = reviews.reviews[i].userName;

        totalReviews.innerHTML += `${username} ${review} ${rating} created at ${createdAT} </br>`; // dont know if we need the created at
    }
}

app();