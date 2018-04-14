

var express = require('express');

var app = express();

app.use(express.static("Public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3000, function () {
});

//Arr nameUser
var ArrUser = [];


//socket.io
io.on("connection", function (socket) {
    //client Sent Message
    socket.on("clientSendUserName", function (data) {
        if (data) {
            if (ArrUser.indexOf(data) >= 0) {
                socket.emit("clientSendUserNameFail")
            }
            else {
                socket.UserName = data;
                ArrUser.push(data);
                socket.emit("clientSendUserNameSuccess", data);

                io.sockets.emit("ServerSendListUser", ArrUser);
            }
        }
    });

    //Client Logout
    socket.on("logoutUserName", function (data) {
        if (data) {
            ArrUser.splice(ArrUser.indexOf(data), 1);
            socket.broadcast.emit('Handle-logout', data);

        }
        socket.broadcast.emit("ServerSendListUser", ArrUser);

    });

    //Client Chat
    socket.on("Send-message", function (data) {
        if (data)
            socket.broadcast.emit("Send-message", { Name: socket.UserName, content: data });
    });

    socket.on('typing', function (data) {
        if (data === 1)
            socket.broadcast.emit('typing', { Name: socket.UserName, dem: data + 1 });


    });


});


app.get("/", function (req, res) {
    res.render("index");
});
app.get("/index", function (req, res) {
    res.render("index");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/forgotPw", function (req, res) {
    res.render("forgotPw");
});

app.get("/chat", function (req, res) {
    res.render("chat");
});
