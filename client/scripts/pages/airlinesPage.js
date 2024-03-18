const airlinesContainer = document.getElementById("airlines-container");
const filterBtn = document.getElementById("airlines-filter");

let airlines = [];
let filterValue = "any";

const getAirlines = async () => {
  try {
    const res = await fetch(`${apiURL}/airlines/airlinesApi.php`);
    const data = await res.json();
    airlines = data.airlines;
  } catch (error) {
    console.log(error);
  }
};

const generateAirlines = (array) => {
  airlinesContainer.innerHTML = "";
  array.forEach((a) => {
    airlinesContainer.innerHTML += `<a
                                        href="/client/pages/airlines/singleAirlinePage.html?id=${a.id}"
                                        class="flex column gap airline-card"
                                        >
                                        <img src="${a.logo}" alt="" />
                                        <div class="flex column gap p">
                                        <h2>${a.name}</h2>
                                        <div class="w-full flex justify-between">
                                            <small>${a.flightsNumber} flights</small>
                                            <small><i class="fa-solid fa-star rate-color"></i> ${a.rating}</small>
                                        </div>
                                        </div>
                                        </a>`;
  });
};

const filterAirlines = (key) => {
  if (key == "rating") {
    const newAirlines = airlines.sort((a, b) => b.rating - a.rating);
    generateAirlines(newAirlines);
  } else if (key == "flights") {
    const newAirlines = airlines.sort(
      (a, b) => b.flightsNumber - a.flightsNumber
    );
    generateAirlines(newAirlines);
  } else {
    const newAirlines = airlines.sort((a, b) => b.id - a.id);
    generateFlights(newAirlines);
  }
};

const app = async () => {
  await getAirlines();
  generateAirlines(airlines);
  filterBtn.addEventListener("change", (e) => {
    filterAirlines(e.target.value);
  });
};
app();
