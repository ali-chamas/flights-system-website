const editPopup = document.getElementById("edit-popup")
const newPassengerSeat = document.getElementById("new-passenger-seat");
const bodyTable = document.getElementById("tbody")
const btn = document.getElementById("btn")

let elementid;

const getAllBookings = () => {
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

const updateSeatNumber = (id, newSeatNumber) => {
    fetch(`http://localhost/flights-system-website/server/bookings/updateBooking.php?id=${id}&newSeatNumber=${newSeatNumber}`, {
        method: "PUT",
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

getAllBookings();

function addPopup(buttonid){
    editPopup.classList.add("open-popup");
    const parentElement = buttonid.closest("tr");
    elementid = parentElement.id;
}


function removePopup(){
    editPopup.classList.remove("open-popup");
}


const renderLoadedData = (data) =>{
    bodyTable.innerHTML = "";

        data.bookings.forEach((booking) => {
            addTable(booking);
        });
}

const addTable = (booking) => {
    bodyTable.innerHTML += ` <tr id="${booking.id}">
    <td class="text-align line-right">${booking.passenger_name}</td>
    <td class="text-align line-right">${booking.id}</td>
    <td class="text-align line-right">${booking.price}</td>
    <td class="text-align line-right">${booking.seatNumber}</td>
    <td class="text-align line-right">${booking.departure}</td>
    <td class="text-align line-right">${booking.destination}</td>
    <td class="text-align"><button class="accept fa solid fa-pen-to-square text-secondary action-button" onclick=addPopup(this);></button>
    <button class="reject fa-solid fa-x text-secondary action-button" onclick=deleteBooking(this);></button>
    </td>
    </tr> `;
}

const modifySeat = () => {
    console.log('clicked');
    newSeatNumber = newPassengerSeat.value;
    console.log(newSeatNumber);
    console.log(elementid);
    if (!newSeatNumber){
        alert("Chose a New Seat Number");
    }
    else{
        console.log(id);
        updateSeatNumber(id, newSeatNumber);
    }
}