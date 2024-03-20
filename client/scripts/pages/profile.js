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