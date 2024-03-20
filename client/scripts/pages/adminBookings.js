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

const getCertainBooking = (id, newFlightStatus) => {
    fetch(`http://localhost/flights-system-website/server/bookings/updateBooking.php?id=${id}`, {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            seatID = data.booking.seatID;
            console.log(data.booking.seatID);
        })
        .then(() => {
            modifyStatusRequest(seatID, newFlightStatus);
        })
        .then(()=>{
            removePopup();
        })
        .catch((error) => {
            console.error(error);
        });

};

const modifyStatusRequest = (id, newFlightStatus) => {
    fetch(`http://localhost/flights-system-website/server/bookings/updateBooking.php?id=${id}&newSeatNumber=${newFlightStatus}`, {
        method: "PUT",
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .then( () =>{
            getAllBookings();
        })
        .catch((error) => {
            console.error(error);
        });
};

const deleteBookingRequest = (id) => {
    console.log(id);
    console.log("deletedID");
    fetch(`http://localhost/flights-system-website/server/bookings/updateBooking.php?id=${id}`, {
        method: "DELETE",
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .then( () =>{
            getAllBookings();
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
    <td class="text-align line-right">${booking.status}</td>
    <td class="text-align"><button class="accept fa solid fa-pen-to-square text-secondary action-button" onclick=addPopup(this);></button>
    <button class="reject fa-solid fa-x text-secondary action-button" onclick=deleteBooking(this);></button>
    </td>
    </tr> `;
}

const modifyStatus = () => {
    console.log('clicked');
    newFlightStatus = newPassengerSeat.value;
    console.log(newFlightStatus);
    console.log(elementid);
    if (!newFlightStatus){
        alert("Chose a New Seat Number");
    }
    else{
        getCertainBooking(elementid, newFlightStatus);
    }
}

const deleteBooking = (buttonid) => {
    const parentElement = buttonid.closest("tr");
    bookingId = parentElement.id;
    console.log(bookingId)
    deleteBookingRequest(bookingId);
}