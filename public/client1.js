const usernames = document.querySelector("#username").textContent.split(":")[1]; 
const room = document.querySelector("#room").textContent;
const phoneNumbers = document.querySelector("#phone").textContent;

const socket = io();

let mySocketId;

socket.on("connect", () => {
  mySocketId = socket.id;
  console.log("Connected to server");
  if (usernames) {
    socket.emit("user-name", usernames);
  }
  socket.emit("join-room", { room, phoneNumbers }); // Join room with phone numbers
  
});

document.querySelector("#connection").addEventListener("click", () => {
  const number = prompt("Enter mobile number");
  socket.emit("check-number", number);
});

socket.on("notification", (notification, id,time) => {
  const isSelf = id === mySocketId;
  appendMessage(notification, isSelf,time);
});

socket.on("personal-notification", (notifyUser, id,time) => {
  const isSelf = mySocketId === id;
  appendMessage(`${notifyUser} `, isSelf,time );
});

function appendMessage(message, isSelf, time = "") { // Added time parameter with default empty value
  const messagesBox = document.querySelector(".messages");
  const newDiv = document.createElement("div");
  newDiv.innerText = time ? `${message} (${time})` : message; // Display message with timestamp if provided
  newDiv.classList.add(isSelf ? "message-right" : "message-left");
  messagesBox.appendChild(newDiv);
  //messagesBox.scrollTop=messagesBox.scrollHeight
}

socket.on("user-connected", (data, id,time) => {
  const isSelf = mySocketId === id;
  appendMessage(`${data} `, isSelf,time);
});

socket.on("chat-message", (message, id, time) => { // Added time parameter
  const isSelf = mySocketId === id;
  appendMessage(`${message}`, isSelf, time); // Passing the time to appendMessage
});

socket.on("disconnected", (user, id) => {
  const isSelf = mySocketId === id;
  appendMessage(`${user} has been disconnected`, isSelf);
});

document.querySelector(".form").addEventListener("submit", function (event) {
  event.preventDefault();
  const messageInput = document.querySelector("#inpmessages").value;
  appendMessage(messageInput, true, new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})); // Adding time for the sender's message
  document.querySelector("#inpmessages").value = "";
  socket.emit("chat-message", messageInput);
});
