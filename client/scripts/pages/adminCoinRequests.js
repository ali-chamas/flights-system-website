const userID = document.getElementById("user-id");
const bodyTable = document.getElementById("tbody");
// const deleteRequest = document.querySelectorAll("deleteRequest");
// const acceptRequest = document.querySelectorAll("acceptRequest");

const getAllRequests = () => {
    fetch("http://localhost/flights-system-website/server/coins/handleRequests.php", {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            renderLoadedData(data);
        })
        .catch((error) => {
            console.error(error);
        });

};

getAllRequests();

function renderLoadedData(data){
    bodyTable.innerHTML = "";
    if (data && data.requests) {
        data.requests.forEach((request) => {
            addTable(request);
        });
    } else {
        console.error("Invalid response data format");
    }
}

function addTable(request){
    bodyTable.innerHTML += ` <tr id="${request.id}">
    <td class="text-align">${request.id}</td>
    <td class="text-align">${request.amount}</td>
    <td class="text-align"><button class="accept fa-solid fa-check text-secondary action-button" onclick=accept(this);></button>
    <button class="reject fa-solid fa-x text-secondary action-button" onclick=reject(this);></button>
    </td>
    </tr> `;
}

function accept(test){
    console.log('clicked');
    const parentElement = test.closest("tr");
    console.log(parentElement.id) 
    console.log(parentElement)
}

function reject(test){
    console.log('clicked');
    const parentElement = test.closest("tr");
    console.log(parentElement.id) 
    console.log(parentElement)
}
