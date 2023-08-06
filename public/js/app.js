const socket = io();

const btnName = document.querySelector(".btn-name");
const inputName = document.querySelector(".user-name input");
const userLabel = document.querySelector(".form-msg label");
const login = document.querySelector(".login");
const formMsg = document.querySelector(".form-msg");
const formSave = document.querySelector(".form-save");
const chat = document.querySelector(".chat");
const msg = document.getElementById("msg");
let userName = "";

btnName.addEventListener("click", () => {
	userName = inputName.value;
	userLabel.innerHTML = userName;
	login.style.display = "none";
  socket.emit("con_user", { name: userName });
});

socket.on("on_user", (user) => {
	const li = document.createElement("li");
	li.innerHTML = `
  <p class="name">System</p>
  <p class="message">user "${user.name}" is connected</p>`;
	chat.appendChild(li);
});

socket.on("off_user", (user) => {
	const li = document.createElement("li");
	li.innerHTML = `
  <p class="name">System</p>
  <p class="message">user "${user.name}" is disconnected</p>`;
	chat.appendChild(li);
});

formMsg.addEventListener("submit", (e) => {
	e.preventDefault();
	socket.emit("send_msg", { name: userName, msg: msg.value });
	msg.value = "";
});

formSave.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("save_chat", chat.innerHTML);
})

fetch("/load-chat")
  .then((res) => res.text())
  .then((data) => {
    chat.innerHTML = data;
  })

socket.on("new_msg", (message) => {
	const li = document.createElement("li");
	li.innerHTML = `
  <p class="name">${message.name}</p>
  <p class="message">${message.msg}</p>`;
	chat.appendChild(li);
});
