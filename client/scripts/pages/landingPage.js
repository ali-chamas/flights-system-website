const destinationInput = document.getElementById("destination-input");
const searchBtn = document.getElementById("search-btn");

let searchValue = "";

const searchFlight = async (destination) => {
  try {
    const res = await fetch(
      `${apiURL}/flights/searchFlight.php?destination=${destination}`
    );
    const data = await res.json();
    if (data.status == "failed") {
      window.location.assign(`/client/pages/404/not-found.html`);
    } else {
      window.location.assign(
        `/client/pages/flights/singleFlightPage.html?id=${data.id}`
      );
    }
  } catch (error) {
    console.log(error);
  }
};

destinationInput.addEventListener("change", (e) => {
  searchValue = e.target.value;
});

searchBtn.addEventListener("click", () => searchFlight(searchValue));
