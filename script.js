const balence = document.getElementById("balence");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// dummy transcation 
const dummyTransactions = [
    {id:1, text:"Flower", amount:-20},
    {id:2, text:"Salary", amount:300},
    {id:3, text:"Book", amount:-10},
    {id:4, text:"Camera", amount:150},
];

let Transcation = dummyTransactions;

function addTranscationDOM(transcation) {
    console.log(transcation);
    const sign = transcation[0].amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(
        transcation[0].amount< 0 ? "minus" : "plus"
    )

    item.innerHTML = `${transcation[0].text}<span>${sign}${Math.abs(transcation[0].amount)}</span> <button class="delete-btn" onclick=""><i class="fa-solid fa-xmark"></i></button>`;
    list.appendChild(item);

}
addTranscationDOM(Transcation);