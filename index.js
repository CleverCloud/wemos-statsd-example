const express = require("express");
const app = express();
const server = require("http").Server(app);
const WebSocket = require("ws")
const bodyParser = require("body-parser");
const path = require("path");
const statsd = require('node-statsd');
const statsdMiddleware = require('express-statsd');

const statsdClient = new statsd();
server.listen(process.env.PORT || 8080);

app.use(statsdMiddleware());
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
  statsdClient.increment('wemos_connections');
  console.log("new client");
});

setInterval(() => {
  statsdClient.gauge('wemos_clients', [...wsServer.clients].length);
}, 10000);
