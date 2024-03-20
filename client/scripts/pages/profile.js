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