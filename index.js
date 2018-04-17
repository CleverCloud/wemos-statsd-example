const express = require("express");
const app = express();
const server = require("http").Server(app);
const WebSocket = require("ws")
const bodyParser = require("body-parser");
var path = require("path");

server.listen(process.env.PORT || 8080);

app.use(express.static(__dirname + '/public'));

const wsServer = new WebSocket.Server({ server });

app.use(bodyParser.text());



app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.put("/color", function(req, res) {
  wsServer.clients.forEach(function(client) {
    if(client.readyState === WebSocket.OPEN) {
      client.send(req.body);
    }
  });
  res.send("Ok.");
});

app.get("/status", function (req, res) {
  const client_number = [...wsServer.clients].length;
  res.send({client_number});
});

wsServer.on("connection", function (ws, req) {
  console.log("new client");
});
