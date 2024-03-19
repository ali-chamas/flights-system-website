const urlParams = new URLSearchParams(window.location.search);
const flightID = urlParams.get("id");

const departureToDestination = document.getElementById(
  "departure-to-destination"
);
const ticketsContainer = document.getElementById("tickets-container");
const reviewsContainer = document.getElementById("reviews-container");
const flightName = document.getElementById("flight-name");
const flightRating = document.getElementById("rating");
const ratingBtn = document.getElementById("rating-btn");
const popup = document.getElementById("rating-popup");
const ratingInput = document.getElementById("rating-input");
const reviewInput = document.getElementById("review-input");
const submitBtn = document.getElementById("submit-btn");
const closeBtn = document.getElementById("close-btn");

let flight = {};
let tickets = [];
let reviews = [];

const userReview = {
  rating: 0,
  review: "",
};

const getFlight = async () => {
  try {
    const response = await fetch(
      `http://localhost/flights-system-website/server/flights/flightsApi.php?id=${flightID}`
    );
    const data = await response.json();
    flight = data.flight;
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

    if (data.status == "Failed") {
    } else {
      tickets = data.allTickets;
    }
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
    if (data.status == "Failed") {
    } else {
      reviews = data.reviews;
    }
  } catch (error) {
    console.error(error);
    alert("Error occured while sending request");
  }
};

const generateTickets = () => {
  ticketsContainer.innerHTML = "";

  tickets.forEach((ticket) => {
    ticketsContainer.innerHTML += `
    <div class="flex  p ticket-card bg-primary align-center">
      <img src=${flight.airlineImage} alt=""/>
       <div class="flex column gap">
        <b>date:</b>
        <small>${ticket.date}</small>
       </div>
       <div class="flex column gap">
        <b>seats:</b>
        <small>${ticket.totalSeats}</small>
       </div>
       <div class="flex column gap">
        <b>price:</b>
        <small>${ticket.price}</small>
       </div>
       <button class="btn-style bg-secondary text-white">Book</button>
    </div>

    `;
  });
};

const generateReviews = () => {
  reviewsContainer.innerHTML = "";

  reviews.forEach((review) => {
    reviewsContainer.innerHTML += `<div class="flex column review-card w-full gap p bg-primary">
    <div class="w-full flex justify-between">
      <b>${review.userName}</b>
      <small><i class="fa-solid fa-star rate-color"></i> ${review.rating}</small>
    </div>
    <small
      >${review.review}
    </small>
  </div>`;
  });
};

const generateFlight = () => {
  flightName.innerText = `${flight.departure} - ${flight.destination} `;
  flightRating.innerText = flight.rating;
};

const checkSession = () => {
  if (!window.localStorage.getItem("session")) {
    return true;
  } else return false;
};

const addReview = async () => {
  if (checkSession()) {
    window.location.assign("/client/pages/auth/auth.html");
    return;
  } else {
    const currentUser = JSON.parse(window.localStorage.getItem("session"));
    const reviewBody = new FormData();
    reviewBody.append("flightID", flightID);
    reviewBody.append("userID", currentUser.id);
    reviewBody.append("review", userReview.review);
    reviewBody.append("rating", userReview.rating);

    try {
      const res = await fetch(`${apiURL}/flights/rateFlights.php`, {
        method: "POST",
        body: reviewBody,
      });
      const data = await res.json();
      console.log(data);
      resetReview();
      await getFlight();
      generateFlight();
      await getReviews();
      generateReviews();
      closePopup();
    } catch (error) {
      console.log(error);
    }
  }
};

const resetReview = () => {
  userReview.rating = 0;
  userReview.review = "";
  reviewInput.value = "";
  ratingInput.value = 0;
};

const openPopup = () => {
  popup.classList.remove("hidden");
  popup.classList.add("flex");
};
const closePopup = () => {
  popup.classList.add("hidden");
  popup.classList.remove("flex");
};

const app = async () => {
  await getFlight();
  await getReviews();
  await getTickets();
  generateReviews();
  generateFlight();
  generateTickets();

  ratingBtn.addEventListener("click", openPopup);
  closeBtn.addEventListener("click", closePopup);
  reviewInput.addEventListener(
    "change",
    (e) => (userReview.review = e.target.value)
  );
  ratingInput.addEventListener(
    "change",
    (e) => (userReview.rating = e.target.value)
  );

  submitBtn.addEventListener("click", addReview);
};

app();
