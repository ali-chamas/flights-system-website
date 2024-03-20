let editPopup = document.getElementById("edit-popup")
let newPassengerSeat = document.getElementById("new-passenger-seat");
const bodyTable = document.getElementById("tbody")


const getAllRequests = () => {
    fetch("http://localhost/flights-system-website/server/bookings/updateBooking.php", {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            renderLoadedData(data);
        })
        .catch((error) => {
            console.error(error);
        });

};


getAllRequests();

function addPopup(){
    editPopup.classList.add("open-popup");
}


function removePopup(){
    editPopup.classList.remove("open-popup");
}


function renderLoadedData(data){
    bodyTable.innerHTML = "";

        data.bookings.forEach((booking) => {
            addTable(booking);
        });
}

function addTable(booking){
    bodyTable.innerHTML += ` <tr id="${booking.id}">
    <td class="text-align line-right">${booking.passenger_name}</td>
    <td class="text-align line-right">${booking.id}</td>
    <td class="text-align line-right">${booking.price}</td>
    <td class="text-align line-right">${booking.seatNumber}</td>
    <td class="text-align line-right">${booking.departure}</td>
    <td class="text-align line-right">${booking.destination}</td>
    <td class="text-align"><button class="accept fa solid fa-pen-to-square text-secondary action-button" onclick=addPopup();></button>
    <button class="reject fa-solid fa-x text-secondary action-button";></button>
    </td>
    </tr> `;
}

function formIsEmpty(form) { 
    let inputs = form.getElementsByTagName('input')
    console.log(inputs)
  for (i = 0; i < inputs.length; i++) { 
    if (inputs[i].value.length == 0) return true; 
  } 
  return false; 
}
