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

const bookingPopup = document.getElementById("booking-popup");
const userBalance = document.getElementById("user-balance");
const flightDestination = document.getElementById("flight-destination");
const flightDate = document.getElementById("flight-date");
const seatSelect = document.getElementById("seat-select");
const ticketPrice = document.getElementById("ticket-price");

let flight = {};
let tickets = [];
let reviews = [];
let singleTicket = {};
let seats = [];

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

const getSingleTicket = async (id) => {
  tickets.forEach((t) => {
    if (t.id == id) {
      singleTicket = t;
    }
  });
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
       <button class="btn-style bg-secondary text-white" onclick="openBookingPopup(${ticket.id})">Book</button>
    </div>

    `;
  });
};

const getSeats = async (id) => {
  seats = [];
  try {
    const res = await fetch(`${apiURL}/seats/seatsApi.php?id=${id}`);
    const data = await res.json();
    if (data.status == "success") seats = data.seats;
  } catch (error) {
    console.log(error);
  }
};

const generateSeats = () => {
  seatSelect.innerHTML = "";
  seats.forEach((seat) => {
    if (seat.isAvailable == 1) {
      seatSelect.innerHTML += `<option value="${seat.id}">${seat.seatNumber}</option>`;
    }
  });
};

const bookTicket = async (id) => {
  const currentUser = JSON.parse(window.localStorage.getItem("user"));
  try {
    const res = await fetch(`${apiURL}/bookings/bookTickets.php`, {
      method: "POST",
      body: JSON.stringify({ seatID: id, userID: 2 }),
    });
    const data = await res.json();
    console.log(data);
    if (data.status == "success") {
      closeBookingPopup();
    } else {
      alert(data.status);
    }
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (id) => {
  try {
    const res = await fetch(`${apiURL}/users/usersApi.php?id=${id}`);
    const data = await res.json();

    return data.user;
  } catch (error) {
    console.log(error);
  }
};

const openBookingPopup = async (id) => {
  const currentUser = JSON.parse(window.localStorage.getItem("user"));

  bookingPopup.classList.remove("hidden");
  bookingPopup.classList.add("flex");
  await getSeats(id);
  generateSeats();
  await getSingleTicket(id);
  const activeUser = await getUser(2);
  console.log(activeUser);
  document.getElementById("user-balance").innerText = activeUser.coins;
  const confirmBtn = document.getElementById("confirm-btn");
  const closeBooking = document.getElementById("close-booking");
  closeBooking.addEventListener("click", closeBookingPopup);
  document.getElementById(
    "flight-destination"
  ).innerText = `${flight.departure} - ${flight.destination}`;

  document.getElementById("flight-date").innerText = singleTicket.date;
  document.getElementById(
    "ticket-price"
  ).innerText = `total : ${singleTicket.price}`;

  let seatID = 0;
  seatSelect.addEventListener("change", (e) => (seatID = e.target.value));
  confirmBtn.addEventListener("click", async () => {
    if (!currentUser) {
      window.location.assign("/client/pages/auth/auth.html");
      return;
    } else {
      await bookTicket(seatID);
    }
  });
};

const closeBookingPopup = () => {
  bookingPopup.classList.add("hidden");
  bookingPopup.classList.remove("flex");
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
