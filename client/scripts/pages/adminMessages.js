const rightDiv = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const closeChat = document.getElementById("close-chat");
const messagesContainer = document.getElementById("messages-container");

const sendBtn = document.getElementById("send-btn");

let messageCardContainer = document.getElementById("message-card-container");

let chatMessages = [];
let messages = [];

const getMessages = async () => {
  try {
    const response = await fetch(
      "http://localhost/flights-system-website/server/messages/receive.php",
      { method: "GET" }
    );
    const data = await response.json();
    messages = data.messages;
  } catch (error) {
    console.error(error);
    alert("Error occured while sending request");
  }
};

const getMessagesById = async (id) => {
  try {
    const response = await fetch(
      `http://localhost/flights-system-website/server/messages/receive.php?id=${id}`,
      { method: "GET" }
    );
    const data = await response.json();
    console.log(data.messages);
    return data.messages;
  } catch (error) {
    console.error(error);
    alert("Error occured while sending request");
  }
};

const generateMessages = () => {
  messageCardContainer.innerHTML = "";
  console.log(messages);
  const res = [
    ...messages
      .reduce((a, c) => {
        a.set(c.sender, c);
        return a;
      }, new Map())
      .values(),
  ];
  console.log(res);

  res.forEach((message) => {
    if (message.receiver == null) {
      messageCardContainer.innerHTML += `<div class="message-card">
        <div class="image">
        <img src="${message.senderImage}" />
        </div>
        <div class="user-message">
            <div class="user">
                <p>${message.senderUsername}</p>
            </div>
            
        </div>
        <div>
        <button onclick="displayChat(${message.sender})" class="button">Chat back</button>
        </div>
        </div>`;
    }
  });
};

const displayChat = async (id) => {
  rightDiv.classList.remove("hidden");
  await generateChat(id);
};
closeChat.addEventListener("click", () => {
  rightDiv.classList.add("hidden");

  chatMessages = [];
});

const generateChat = async (id) => {
  const currentUser = JSON.parse(window.localStorage.getItem("session"));
  chatMessages = await getMessagesById(id);
  console.log(chatMessages);
  chatMessages.sort((a, b) => a.id - b.id);
  messagesContainer.innerHTML = "";
  console.log(messages);
  chatMessages.forEach((m) => {
    if (m.sender == id) {
      messagesContainer.innerHTML += ` <div class="flex column gap message-style receiver">
        <b>${m.senderUsername}</b>
        <small>${m.message}</small>
        <small class="text-gray">${m.sentAt}</small>
      </div>`;
    } else {
      messagesContainer.innerHTML += ` <div class="flex column gap message-style sender">
        <b>${currentUser.name}</b>
        <small>${m.message}</small>
        <small class="text-gray">${m.sentAt}</small>
      </div>`;
    }
  });
};

const sendMessage = async () => {
  const currentUser = JSON.parse(window.localStorage.getItem("session"));
  let receiverId;
  if (chatMessages[0].sender == currentUser.id) {
    receiverId = chatMessages[0].receiver;
  } else {
    receiverId = chatMessages[0].sender;
  }
  console.log(receiverId);
  try {
    const formData = new FormData();
    formData.append("message", input.value);
    formData.append("userID", currentUser.id);
    formData.append("receiver", receiverId);
    const response = await fetch(
      "http://localhost/flights-system-website/server/messages/send-to-user.php",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    input.value = "";
    await generateChat(receiverId);
  } catch (error) {
    console.error(error);
    // alert("Error occured while sending request");
  }
};

const app = async () => {
  await getMessages();
  generateMessages();

  sendBtn.addEventListener("click", async () => {
    console.log("s");
    await sendMessage();
    await getMessages();
    generateChat();
  });
};

app();
