var express = require('express');
var appController = require('./Controller/appController');

var app = express();

app.use(express.static("Public"));
app.set("view engine", "ejs");
app.set("views", "./views");


var server = require("http").Server(app);
var io = require("socket.io")(server);

appController(app, io);

server.listen(3000, function () {
});
