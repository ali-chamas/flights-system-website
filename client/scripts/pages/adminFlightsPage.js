const flightsContainer = document.getElementById("flights-container");
const filterBtn = document.getElementById("flights-filter");
const addFlightPopup = document.getElementById("add-flight-popup")
const departureInput = document.getElementById("departure")
const arrivalInput = document.getElementById("arrival");
const departureTimeInput = document.getElementById("departure-time");
const arrivalTimeInput = document.getElementById("arrival-time")
const imageInput = document.getElementById("image")
const airlinesOptions = document.getElementById("airline")
const editFlightPopup = document.getElementById("edit-flight-popup")
const airlinesOptionsEdit = document.getElementById("airlineEdit")
const departureInputEdit = document.getElementById("departureEdit")
const arrivalInputEdit = document.getElementById("arrivalEdit");
const departureTimeInputEdit = document.getElementById("departure-timeEdit");
const arrivalTimeInputEdit = document.getElementById("arrival-timeEdit")
const imageInputEdit = document.getElementById("imageEdit")
const addTicketPopup = document.getElementById("add-ticket-popup")
const totalSeats = document.getElementById("total-seats")
const ticketDate = document.getElementById("ticket-date")
const ticketPrice = document.getElementById("ticket-price")


let flights = [];
let filterValue = "any";
airlinesIds = [];
let flightToEditId = 0;

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
                                        id="${a.id}"
                                        class="flex column gap flight-card"
                                        onclick=setId(id);
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

function openPopup(popup){
  popup.classList.add("open-popup");
}


function removePopup(popup){
  popup.classList.remove("open-popup");
}

const getAirLines = async () => {
  airlinesIds = [];
  try {
    const res = await fetch(`${apiURL}/airlines/airlinesApi.php`);
    const data = await res.json();
    if (data.status == "success") airlinesIds = data.airlines;
    console.log(airlinesIds);
  } catch (error) {
    console.log(error);
  }
};

const generateAirlineOptions = () => {
  airlinesOptions.innerHTML = "";
  airlinesOptionsEdit.innerHTML = "";

  airlinesIds.forEach((airline) => {
    airlinesOptions.innerHTML += `<option value="${airline.id}">${airline.id}</option>`;
  });
  airlinesIds.forEach((airline) => {
    airlinesOptionsEdit.innerHTML += `<option value="${airline.id}">${airline.id}</option>`;
  });
};

const showAirlinesOptions = async () => {
  await getAirLines();
  generateAirlineOptions();
}

showAirlinesOptions();


const addFlight = async () => {
  if (inputIsEmpty(addFlightPopup)){
    alert("Please fill all details");
  }
  else{
    let formData = new FormData();
    formData.append('departure', departureInput.value);
    formData.append('arrival', arrivalInput.value);
    formData.append('departureTime', departureTimeInput.value);
    formData.append('arrivalTime', arrivalTimeInput.value);
    formData.append('image', imageInput.value);
    formData.append('airlineID', airlinesOptions.value);

    await addFlightRequest(formData);
    await getFlights();
    generateFlights(flights);
    removePopup(addFlightPopup);
  }
}


const addFlightRequest = async (formData) => {
  try {
      const response = await fetch(`http://localhost/flights-system-website/server/flights/flightsApi.php`, {
          method: "POST",
          body: formData
      });
      const data = await response.json();
      console.log(data);
  } catch (error) {
      console.error(error);
  }
};

function inputIsEmpty(popup) { 
  let inputs = popup.getElementsByTagName('input')
  console.log(inputs)
for (let i = 0; i < inputs.length; i++) { 
  if (inputs[i].value.length == 0) return true; 
} 
return false; 
}

const setId = (id) => {
  flightToEditId = id;
  console.log(id)
  openPopup(editFlightPopup);
}

const editFlight = async () => {
  if (inputIsEmpty(editFlightPopup)){
    alert("Please fill all details");
  }
  else{
    let formData = new FormData();
    formData.append('id', flightToEditId);
    formData.append('departure', departureInputEdit.value);
    formData.append('arrival', arrivalInputEdit.value);
    formData.append('departureTime', departureTimeInputEdit.value);
    formData.append('arrivalTime', arrivalTimeInputEdit.value);
    formData.append('image', imageInputEdit.value);
    formData.append('airlineID', airlinesOptionsEdit.value);

    await editFlightRequest(formData);
    await getFlights();
    generateFlights(flights);
    removePopup(editFlightPopup);
  }
}

const editFlightRequest = async (formData) => {
  try {
      const response = await fetch(`http://localhost/flights-system-website/server/flights/editFlight.php`, {
          method: "POST",
          body: formData
      });
      const data = await response.json();
      console.log(data);
  } catch (error) {
      console.error(error);
  }
};

const addTicket = () => {
  removePopup(editFlightPopup);
  openPopup(addTicketPopup);
}

const submitTicket = async () =>{
  if (inputIsEmpty(addTicketPopup)){
    alert("Please fill all details");
  }
  else{
    let formData = new FormData();
    formData.append('totalSeats', totalSeats.value);
    formData.append('date', ticketDate.value);
    formData.append('price', ticketPrice.value);
    formData.append('flightID', flightToEditId);


    await addTicketRequest(formData);
    await getFlights();
    generateFlights(flights);
    removePopup(addTicketPopup);
  }
}

const addTicketRequest = async (formData) => {
  try {
      const response = await fetch(`http://localhost/flights-system-website/server/tickets/add.php`, {
          method: "POST",
          body: formData
      });
      const data = await response.json();
      console.log(data);
  } catch (error) {
      console.error(error);
  }
};