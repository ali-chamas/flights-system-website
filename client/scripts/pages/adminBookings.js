

let popupTransaction = document.getElementById("edit-popup")

let passengerName = document.getElementById("passenger-name");
let amount = document.getElementById("flight");
let transactionForm = document.getElementById("edit-form")
let bodyTable = document.getElementById("tbody");
let rowRemover = document.querySelectorAll("row-remove");
console.log(rowRemover);

function loadData(){
    allTransaction = JSON.parse(localStorage.getItem(("transactions")) || "[]");
    transactionNumber = allTransaction.length;
    console.log(allTransaction);
}

loadData();

function renderLoadedData(){
    for(i=0; i < allTransaction.length;i++){
        addTable(allTransaction[i]);
        updateIncome(allTransaction[i]);
        renderNetIncomeData();
    }
}

renderLoadedData();

function addPopup(){
    popupTransaction.classList.add("open-popup");
}

function removePopup(){
    popupTransaction.classList.remove("open-popup");
}

function addTable(newtrans){
    bodyTable.innerHTML += ` <tr id = "${newtrans.id}">
    <td id="tdate">${newtrans.transDate}</td>
    <td id="tTransactionType">${newtrans.transType}</td>
    <td id="tAmount">${newtrans.transAmount}</td>
    <td id="tAction"><i onclick="addPopup()" " class="fa-regular fa-pen-to-square row-edit text-secondary"></i>
    <i id= "row-remover" class="fa-regular fa-x row-remove text-secondary"></i>
    </td>
    </tr> `;
    return;
}

function formIsEmpty(form) { 
    let inputs = form.getElementsByTagName('input')
    console.log(inputs)
  for (let i = 0; i < inputs.length; i++) { 
    if (inputs[i].value.length == 0) return true; 
  } 
  return false; 
}

function saveTransactions(allTransaction){
    localStorage.setItem("transactions", JSON.stringify(allTransaction));
}
