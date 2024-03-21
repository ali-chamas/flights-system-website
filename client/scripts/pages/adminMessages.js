const rightDiv = document.getElementById("right-div");
let messageCardContainer = document.getElementById("message-card-container");
let userChatContainer = document.getElementById("user-chat-container");
let adminReplyContainer = document.getElementById("admin-reply-container");
let messages = [];

const getMessages = async () => {
    try {
        const response = await fetch("http://localhost/flights-system-website/server/messages/receive.php", {method: "GET"});
        const data = await response.json();
        messages = data.messages;

    } catch (error) {
        console.error(error);
        alert("Error occured while sending request");
    }
}



const generateMessages = () => {
    messageCardContainer.innerHTML = "";
    messages.forEach((message) => {
        if (message.receiver == null) {
            messageCardContainer.innerHTML += `<div class="message-card">
        <div class="image">
        <img src="${message.senderImage}" />
        </div>
        <div class="user-message">
            <div class="user">
                <p>${message.senderUsername}</p>
            </div>
            <div class="message">
                <p>${message.message}</p>
            </div>
        </div>
        <div>
        <button onclick="displayChat()" class="button">Chat back</button>
        </div>
        </div>`
        };
        
    });
};

const displayChat = () => {
    rightDiv.classList.remove("hidden");
}

const generateChat = () => {
    userChatContainer.innerHTML="";
    adminReplyContainer.innerHTML="";
    messages.forEach((message) => {
        if (message.receiver == null) {
            userChatContainer.innerHTML += `<div class="img-chat">
            <div class="img">
                <img src="${message.senderImage}" />
            </div>
            <div class="chat-card">
                <div class="user-chat">
                    <p>${message.senderUsername}</p>
                </div>
                <div class="chat">
                    <p>${message.message}</p>
                </div>
            </div>
        </div>
        <p>${message.sentAt}</p>`
        } else {
            adminReplyContainer += `<div class="img-chat">
            <div class="img">
                <img src="${message.senderImage}" />
            </div>
            <div class="reply-card">
                <div class="admin">
                    <p>You</p>
                </div>
                <div class="reply">
                    <p>${message.message}</p>
                </div>
            </div>
        </div>
        <p>${message.sentAt}</p>`
        }
    })

}







const app = async() => {
    await getMessages();
    generateMessages();
}

app();