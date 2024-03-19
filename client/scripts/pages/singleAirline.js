const urlParams = new URLSearchParams(window.location.search);
const airlineID = urlParams.get("id");

const flightsCntainer = document.getElementById("flights-container");
const reviewsContainer = document.getElementById("reviews-container");
const airlineName = document.getElementById("airline-name");
const airlineRating = document.getElementById("rating");
const ratingBtn = document.getElementById("rating-btn");
const popup = document.getElementById("rating-popup");
const ratingInput = document.getElementById("rating-input");
const reviewInput = document.getElementById("review-input");
const submitBtn = document.getElementById("submit-btn");
const closeBtn = document.getElementById("close-btn");

let airline = {};
let flights = [];
let reviews = [];

const userReview = {
  rating: 0,
  review: "",
};

const getAirline = async () => {
  try {
    const response = await fetch(
      `http://localhost/flights-system-website/server/airlines/airlinesApi.php?id=${airlineID}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    airline = data.airline;
  } catch (error) {
    console.error(error);
  }
};

const getFlights = async () => {
  try {
    const response = await fetch(
      `http://localhost/flights-system-website/server/airlines/airlineFlights.php?id=${airlineID}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    if (data.status == "Failed") {
    } else {
      flights = data.flights;
    }
  } catch (error) {
    console.error(error);
  }
};

const getReviews = async () => {
  try {
    const response = await fetch(
      `http://localhost/flights-system-website/server/reviews/view-airlines-reviews.php?id=${airlineID}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    if (data.status == "Failed") {
    } else {
      reviews = data.reviews;
    }
  } catch (error) {
    console.error(error);
  }
};

const generateFlights = () => {
  flightsCntainer.innerHTML = "";

  flights.forEach((a) => {
    flightsCntainer.innerHTML += `<a
    href="/client/pages/flights/singleFlightPage.html?id=${a.id}"
    class="flex column gap flight-card"
    >
    <img src="${a.image}" alt="" />
    <div class="flex column gap p">
    <div class="w-full flex justify-between">
    <div class="flex column gap">
    <b>From</b>
    <p>${a.departure}</p>
    </div>
    <div class="flex column gap">
    <b>To</b>
    <p>${a.destination}</p></div>
    </div>
    
    <div class="w-full flex justify-between">
        <small>${a.airlineName} flights</small>
        <small><i class="fa-solid fa-star rate-color"></i> ${a.rating}</small>
    </div>
    </div>
    </a>`;
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

const generateAirline = () => {
  airlineName.innerText = airline.name;
  airlineRating.innerText = airline.rating;
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
    reviewBody.append("airlineID", airlineID);
    reviewBody.append("userID", currentUser.id);
    reviewBody.append("review", userReview.review);
    reviewBody.append("rating", userReview.rating);

    try {
      const res = await fetch(`${apiURL}/airlines/rateAirlines.php`, {
        method: "POST",
        body: reviewBody,
      });
      const data = await res.json();
      console.log(data);
      resetReview();
      await getAirline();
      generateAirline();
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
  await getAirline();
  await getFlights();
  await getReviews();

  if (flights) {
    generateFlights();
  }
  if (reviews) {
    generateReviews();
  }

  generateAirline();

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
