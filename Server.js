var express = require('express');

var app = express();

app.use(express.static("Public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3000, function() {
});

//Arr nameUser
var ArrUser = [];


//socket.io
io.on("connection", function(socket) {
  //client Sent Message
  socket.on("clientSendUserName", function(data) {

    if (ArrUser.indexOf(data) >= 0) {
      socket.emit("clientSendUserNameFail")
    }
     else{
      socket.UserName = data;
      ArrUser.push(data);
      socket.emit("clientSendUserNameSuccess", data);

        io.sockets.emit("ServerSendListUser", ArrUser);
    }
  });

  //Client Logout
  socket.on("logoutUserName", function() {
    ArrUser.splice(
      ArrUser.indexOf(socket.UserName), 1
    );
    socket.broadcast.emit("ServerSendListUser", ArrUser);
  });

  //Client Chat
  socket.on("Send-message",function (data) {
    socket.emit("Server-Sent-youSelf",data );
    socket.broadcast.emit("Server-Sent-Orther", {Name:socket.UserName, content: data});
  });

    socket.on('typing' ,function () {
      socket.broadcast.emit('typing', socket.UserName);
  });
    


});


app.get("/", function(req, res) {
    res.render("index");
})
