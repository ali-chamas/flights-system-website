const editButton = document.getElementById("edit-btn");
const addEditPopup = document.getElementById("add-edit-popup");
const updateButton = document.getElementById("update-btn");
const cancelButton = document.getElementById("cancel-btn");
const imageInput = document.getElementById("image-input");
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");

editButton.addEventListener("click", () => {
    addEditPopup.classList.remove("hidden");
});
