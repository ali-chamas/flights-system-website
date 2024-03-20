const editButton = document.getElementById("edit-btn");
const addEditPopup = document.getElementById("add-edit-popup");
const updateButton = document.getElementById("update-btn");
const cancelButton = document.getElementById("cancel-btn");
const imageInput = document.getElementById("image-input");
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const requestButton = document.getElementById("request-btn");
const addRequestPopup = document.getElementById("add-request-popup");
const amountCancelButton = document.getElementById("amount-cancel-btn");
const addBookingPopup = document.getElementById("add-booking-popup");
const bookingButton = document.getElementById("booking-btn");
const backButton = document.getElementById("back-btn");
const addReviewsPopup = document.getElementById("add-reviews-popup");
const reviewsButton = document.getElementById("reviews-btn");
const reviewsBackButton = document.getElementById("reviews-back-btn");

editButton.addEventListener("click", () => {
  addEditPopup.classList.remove("hidden");
});

cancelButton.addEventListener("click", () => {
  addEditPopup.classList.add("hidden");
});

requestButton.addEventListener("click", () => {
  addRequestPopup.classList.remove("hidden");
});

amountCancelButton.addEventListener("click", () => {
  addRequestPopup.classList.add("hidden");
});

bookingButton.addEventListener("click", () => {
  addBookingPopup.classList.remove("hidden");
});

backButton.addEventListener("click", () => {
  addBookingPopup.classList.add("hidden");
});

reviewsButton.addEventListener("click", () => {
  addReviewsPopup.classList.remove("hidden");
});

reviewsBackButton.addEventListener("click", () => {
  addReviewsPopup.classList.add("hidden");
});

//fetching and apis

const coinsContainer = document.getElementById("coins-container");
const userImage = document.getElementById("user-image");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");

const bookingsContainer = document.getElementById("bookings-container");

const reviewsContainer = document.getElementById("reviews-container");

let user = {};
let bookings = [];
let flightsReviews = [];
let airlinesReviews = [];

const fetchUser = async () => {
  const currentUser = window.localStorage.getItem("user");

  try {
    const res = await fetch(`${apiURL}/users/usersApi.php?id=${2}`);
    const data = await res.json();
    if (data.status == "Success") {
      user = data.user;
    }
  } catch (error) {}
};

const fetchBookings = async () => {
  try {
    const res = await fetch(`${apiURL}/bookings/getBookings.php?id=${user.id}`);
    const data = await res.json();
    if (data.status == "success") {
      bookings = data.bookings;
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchFlightsReviews = async () => {
  try {
    const res = await fetch(`${apiURL}/users/getFlightsReviews.php?id=2`);
    const data = await res.json();
    if (data.status == "success") {
      flightsReviews = data.reviews;
    }
  } catch (error) {
    console.log(error);
  }
};
const fetchAirlinesReviews = async () => {
  try {
    const res = await fetch(`${apiURL}/users/getAirlinesReviews.php?id=2`);
    const data = await res.json();
    if (data.status == "success") {
      airlinesReviews = data.reviews;
    }
  } catch (error) {
    console.log(error);
  }
};

const generateUserInfo = () => {
  coinsContainer.innerText = user.coins;
  userImage.innerHTML = `<img alt="" src=${user.image}/>`;
  userName.innerText = user.name;
  userEmail.innerText = user.email;
};

const generateBookings = () => {
  bookingsContainer.innerHTML = "";
  bookings.forEach((b) => {
    bookingsContainer.innerHTML += ` <div class="flex gap p bg-primary">
        <b>${b.departure} - ${b.destination}</b>
        <small class="text-gray">${b.date}</small>
        <small>${b.price} coins</small>
        <small>${b.seatNumber}</small>
        <div>
          <small>${b.status}</small>
          <small class="text-danger">Delete</small>

        </div>
      </div>`;
  });
};

const generateReviews = () => {
  reviewsContainer.innerHTML = "";

  flightsReviews.forEach((r) => {
    reviewsContainer.innerHTML += `<div class="bg-primary p flex column">
        <div class="flex justify-between w-full">
          <small>
            <i class="fa-solid fa-star rate-color" ></i>
            ${r.rating}
          </small>
          <small>
          ${r.departure} - ${r.destination}
          <small/>
          
        </div>
        <small class="text-gray">
          ${r.review}
        </small>
    
      </div>`;
  });
  airlinesReviews.forEach((r) => {
    reviewsContainer.innerHTML += `<div class="bg-primary p flex column">
        <div class="flex justify-between w-full">
          <small>
            <i class="fa-solid fa-star rate-color" ></i>
            ${r.rating}
          </small>
          <small>
          ${r.airlineName}
          <small/>
          
        </div>
        <small class="text-gray">
          ${r.review}
        </small>
    
      </div>`;
  });
};

const app = async () => {
  await fetchUser();
  await fetchBookings();
  await fetchFlightsReviews();
  await fetchAirlinesReviews();
  generateUserInfo();
  generateBookings();
  generateReviews();
};

app();
