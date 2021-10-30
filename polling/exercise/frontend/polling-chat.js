const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

// let's store all current messages here
let allChat = [];

// the interval to poll at in milliseconds
const INTERVAL = 3000;

// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  // post to /poll a new message
  const data = {
    user,
    text
  };

  const options = {
    method: "POST", 
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  }

  await fetch("/poll", options)
  // changed to above which is more concise 
  // const res = await fetch("/poll", options);
  // const json = await res.json(); 
}

async function getNewMsgs() { // allows us to use await keyword
  // poll the server
  let json;
  try { 
    const res = await fetch("/poll");
    json = await res.json();

    if (res.status >= 400) {
      throw new Error("request did not succeed: ", + res.status);
    }

    allChat = json.msg; 
    render();
    failedTries = 0; 
  } catch (e) {
    // backoff code 
    console.error("polliing error", e);
    failedTries++;
  }

  // setTimeout(getNewMsgs, INTERVAL); // set interval runs function 3 seconds no matter what, this will do all this first and last thing it does is call setTimeout
}

function render() {
  // as long as allChat is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

// given a user and a msg, it returns an HTML string to render to the UI
const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

// make the first request - removed during polling with requestAnimationFrame lecture
// getNewMsgs();
const BACKOFF = 5000; 
let timeToMakeNextRequest = 0;
let failedTries = 0;
// every time the browser is idle, won't interrupt browser unlike set timeout
async function raftTimer(time) { // time from request animation frame
  if (timeToMakeNextRequest <= time ) {
    await getNewMsgs();
    timeToMakeNextRequest = time + INTERVAL + failedTries * BACKOFF; // linear backoff
  }

  requestAnimationFrame(raftTimer);
}

requestAnimationFrame(raftTimer);
