const app = require("express")();
const server = require("http").Server(app);
const WebSocket = require("ws")
const bodyParser = require("body-parser");

server.listen(process.env.PORT || 8080);
const wsServer = new WebSocket.Server({ server });

app.use(bodyParser.text());

app.get("/", function(req, res) {
  res.send("Hello.");
});

app.put("/color", function(req, res) {
  wsServer.clients.forEach(function(client) {
    if(client.readyState === WebSocket.OPEN) {
      client.send(req.body);
    }
  });
  res.send("Ok.");
});

wsServer.on("connection", function (ws, req) {
  console.log("new client");
});
