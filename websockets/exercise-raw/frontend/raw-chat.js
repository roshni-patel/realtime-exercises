const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");
const presence = document.getElementById("presence-indicator");
let allChat = [];

// listen for events on the form
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  const data = { user, text };

  ws.send(JSON.stringify(data));
}

const ws = new WebSocket("ws://localhost:8080", ["json"]) // create object
// connect to server via HTTP at some endpoint, hey endpoint I want to upgrade this connection, up to server what does upgrade mean
// send an upgrade request, cool I know how to speak websocket then will connect
ws.addEventListener("open", () => {
  console.log("connected")
  presence.innerText = "🟢"
});

ws.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  allChat = data.msg;
  render();
});

ws.addEventListener("close", () => {
  presence.innerText = "🔴";
})

function render() {
  const html = allChat.map(({ user, text }) => template(user, text));
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;
