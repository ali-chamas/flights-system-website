const flightsContainer = document.getElementById("flights-container");
const filterBtn = document.getElementById("flights-filter");
const addFlightPopup = document.getElementById("add-flight-popup")

let flights = [];
let filterValue = "any";

const getFlights = async () => {
  try {
    const res = await fetch(`${apiURL}/flights/flightsApi.php`);
    const data = await res.json();
    flights = data.flights;
    console.log(flights);
  } catch (error) {
    console.log(error);
  }
};

const generateFlights = (array) => {
  flightsContainer.innerHTML = "";
  array.forEach((a) => {
    flightsContainer.innerHTML += `<a
                                        id="{a.id}"
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

const filterFlights = (key) => {
  if (key == "rating") {
    const newFlights = flights.sort((a, b) => b.rating - a.rating);
    generateFlights(newFlights);
  } else if (key == "all") {
    const newFlights = flights.sort((a, b) => b.id - a.id);
    generateFlights(newFlights);
  }
};

const app = async () => {
  await getFlights();
  generateFlights(flights);
  filterBtn.addEventListener("change", (e) => {
    filterFlights(e.target.value);
  });
};

app();

function openPopup(){
  addFlightPopup.classList.add("open-popup");
}


function removePopup(){
  addFlightPopup.classList.remove("open-popup");
}