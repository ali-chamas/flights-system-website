const urlParams = new URLSearchParams(window.location.search);
const flightID = urlParams.get("id");

const departureToDestination = document.getElementById(
  "departure-to-destination"
);
const totalRating = document.getElementById("total-rating");
const availableTickets = document.getElementById("available-tickets");
const totalReviews = document.getElementById("reviews");

let flight = {};
let tickets = [];
let reviews = [];

const getFlight = async () => {
  try {
    const response = await fetch(
      `http://localhost/flights-system-website/server/flights/flightsApi.php?id=${flightID}`
    );
    const data = await response.json();
    flight = data;
  } catch (error) {
    console.error(error);
    alert("Error occured while sending request");
  }
};

const getTickets = async () => {
  try {
    const response = await fetch(
      `http://localhost/flights-system-website/server/tickets/view.php?id=${flightID}`
    );
    const data = await response.json();
    tickets = data;
  } catch (error) {
    console.error(error);
    alert("Error occured while sending request");
  }
};

const getReviews = async () => {
  try {
    const response = await fetch(
      `http://localhost/flights-system-website/server/reviews/view-flights-reviews.php?id=${flightID}`
    );
    const data = await response.json();
    reviews = data;
  } catch (error) {
    console.error(error);
    alert("Error occured while sending request");
  }
};

const app = async () => {
  await getFlight();
  await getReviews();
  await getTickets();
  console.log(reviews);
  console.log(flight);
  console.log(tickets);
};

app();
