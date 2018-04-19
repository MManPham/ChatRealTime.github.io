var bodyParser = require('body-parser');
var  urlencodedParser  =  bodyParser.urlencoded({ 
  extended:  false 
});

var mongoose = require('mongoose');
// connect database
mongoose.connect('mongodb://test:test@ds155424.mlab.com:55424/chatwebapp');

//creat a schema
var Schema = new mongoose.Schema({
  nameUser: String,
  email: String,
  password: String,
});

var appDB = mongoose.model('appDB', Schema);

/*var itemOne = appDB({name:"Pham Man", password:"1234sss"}).save(function (err) {
  if(err) throw err;
  console.log("have Save");
})*/


var data = [];
module.exports = function(app, io) {
  //socket.io
  //Arr nameUser
  var ArrUser = [];
  io.on("connection", function(socket) {
    var flag = 1;
    //client Sent Message
    socket.on("clientSendUserName", function(data) {
      if (data.password && data.email) {
        flag = flag * -1;
        appDB.find({
          "email": data.email
        }, function(err, Store) {
          if (err) throw err;
          if (Store[0]) {
            if (ArrUser.indexOf(Store[0].nameUser) >= 0) {
              socket.emit("clientSendUserNameFail", 1)
            } else {
              socket.UserName = Store[0].nameUser;
              ArrUser.push(Store[0].nameUser);
              socket.emit("clientSendUserNameSuccess", Store[0].nameUser);
              console.log(Store[0].nameUser);
              io.sockets.emit("ServerSendListUser", ArrUser);
            }

          } else {
            socket.emit("clientSendUserNameFail", 0)
          }

        })
      } else {
        {
          if (flag == 1) {
            socket.emit("clientSendUserNameFail")
          }
          flag = flag * -1;
        }
      }
    });

    //Client Logout
    socket.on("logoutUserName", function(data) {
      if (data) {
        ArrUser.splice(ArrUser.indexOf(data), 1);
        socket.broadcast.emit('Handle-logout', data);

      }
      socket.broadcast.emit("ServerSendListUser", ArrUser);

    });

    //Client Chat
    socket.on("Send-message", function(data) {
        if (data){
        socket.broadcast.emit("Send-message", {
          Name: socket.UserName,
          content: data
        });
        }
    });

    socket.on('typing', function(data) {
      if (data === 1){
        socket.broadcast.emit('typing', {
          Name: socket.UserName,
          dem: data + 1
        });
        }
    });


  });


  app.get("/", function(req, res) {
    res.render("index");
  });
  app.get("/index", function(req, res) {
    res.render("index");
  });

  app.get("/register", function(req, res) {
    res.render("register");
  });

  app.post("/register", urlencodedParser, function(req, res) {
    appDB(req.body).save(function(err, data) {
      if (err) throw err;
    });
  });

  app.get("/forgotPw", function(req, res) {
    res.render("forgotPw");
  });

  app.post("/forgotPw",urlencodedParser, function(req, res) {
    appDB.find({
      "email": req.body.name},function (err,data) {
        if(err) throw err;

        if(data[0])
        res.render("forgotPw0",{ result : data[0].password})
        else
        {
          res.render("forgotPw0",{ result : "No result for this email"})

        }
      })

  });

  app.get("/chat", function(req, res) {
    res.render("chat");
  });
}
