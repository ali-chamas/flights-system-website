const openChat = document.getElementById("open-chat");
const closeChat = document.getElementById("close-chat");
const chatBox = document.getElementById("chat-box");
const messagesContainer = document.getElementById("messages-container");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

let messages = [];
let newMessage = "";

const fetchMessages = async () => {
  const currentUser = JSON.parse(window.localStorage.getItem("session"));
  try {
    const res = await fetch(
      `${apiURL}/messages/receive.php?id=${currentUser.id}`
    );
    const data = await res.json();
    messages = data.messages;
  } catch (error) {
    console.log(error);
  }
};

const sendMessage = async (message) => {
  const currentUser = JSON.parse(window.localStorage.getItem("session"));

  try {
    const mess = new FormData();
    mess.append("userID", currentUser.id);
    mess.append("message", message);
    const res = await fetch(`${apiURL}/messages/send-to-admin.php`, {
      method: "POST",
      body: mess,
    });
    const data = await res.json();
    if (data.status == "success") {
      await fetchMessages();
      generateMessages();
      messageInput.value = "";
    }
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const generateMessages = () => {
  const currentUser = JSON.parse(window.localStorage.getItem("session"));
  messagesContainer.innerHTML = "";
  messages.forEach((m) => {
    if (m.receiver == currentUser.id) {
      messagesContainer.innerHTML += ` <div class="flex column gap message-style receiver">
        <b>Admin</b>
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

const handleClose = () => {
  chatBox.classList.add("hidden");
  openChat.classList.remove("hidden");
};
const handleOpen = () => {
  chatBox.classList.remove("hidden");
  openChat.classList.add("hidden");
};

openChat.addEventListener("click", handleOpen);
closeChat.addEventListener("click", handleClose);

const chatApp = async () => {
  await fetchMessages();
  generateMessages();

  messageInput.addEventListener("change", (e) => {
    newMessage = e.target.value;
  });
  sendBtn.addEventListener("click", async () => {
    await sendMessage(newMessage);
  });
};

chatApp();
