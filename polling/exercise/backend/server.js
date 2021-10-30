import express from "express";
import bodyParser from "body-parser";
import nanobuffer from "nanobuffer";
import morgan from "morgan";

// set up a limited array
const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse(); // newest messages first 

// feel free to take out, this just seeds the server with at least one message
msg.push({
  user: "roshni",
  text: "hi",
  time: Date.now(),
});

// get express ready to run
const app = express();
app.use(morgan("dev")); // logging framework
app.use(bodyParser.json()); // deprecated
app.use(express.static("frontend")); // serve the index.html, style.css

app.get("/poll", function (req, res) {
  // use getMsgs to get messages to send back
  res.json({
    msg: getMsgs(),
  });
});

app.post("/poll", function (req, res) {
  // add a new message to the server
  const { user, text } = req.body;

  msg.push({
    user, 
    text, 
    time: Date.now()
  });

  res.json({
    status: "ok",
  })
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`listening on http://localhost:${port}`);
