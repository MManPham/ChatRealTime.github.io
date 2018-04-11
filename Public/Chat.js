

$(document).ready(function () {
    //
    dem=0;
    // ----------Main js
    $('.form-signin ').show();
    $('.container-fluid').hide();

    $('#Signin').click(function () {
        socket.emit("clientSendUserName", $('#inputEmail').val())
    });


    $('#logout').click(function () {
        socket.emit("logoutUserName")
        $('.form-signin ').show();
        $('.container-fluid').hide();
    })

    $('#btn-chat').click(function () {
        var data = $('#content-message').val();
        socket.emit("Send-message", $('#content-message').val())
        $('#content-message').val('');
        dem = 0;
    });

    $('#content-message').keyup(function () {

        socket.emit('typing');

    });
})



//-----Socket
var socket = io("http://localhost:3000/");

//Fail
socket.on("clientSendUserNameFail", function () {
    alert("has a user use this name");
});

//Success
socket.on("clientSendUserNameSuccess", function (data) {
    $('.form-signin ').hide();
    $('.container-fluid').show();
    $('#UserName').text('hi ' + data);
    console.log(data)
});

socket.on("ServerSendListUser", function (data) {
    $('.contact-list').html('');
    data.forEach(function (item) {
        var NameUser = '<div class="contact">' +
            ' <img src="StoreImg/images.png" alt="profilpicture">' +
            '<div class="contact-preview">' +
            ' <div class="contact-text">' +
            '   <h1 class="font-name"><b>' + item + '</b></h1>' +
            ' </div>' +
            '</div>' +
            '<div class="contact-time">' +
            '<p>9:38</p>' +
            '</div>' +
            '</div>'

        $('.contact-list').append(NameUser);
    });
});

socket.on("Server-Sent-youSelf", function (data) {
    var message = '<div class="chat-bubble me">' +
        '<div class="my-mouth"></div>' +
        '<div class="content" >' + data + '</div>' +
        '<div class="time">9:60</div>' +
        '</div>'
    $('.chat').append(message)
});

socket.on("Server-Sent-Orther", function (data) {
    $('.chat p').text('');
    var message = '<div class="chat-bubble you">' +
        '<div class="your-mouth"></div>' +
        '<div class="content" ><b>' + data.Name + ': </b>' + data.content + '</div>' +
        '<div class="time">9:60</div>' +
        '</div>'
    $('.chat').append(message)
});

socket.on('typing', function (data) {
    dem++;
    if (dem == 1)
    $('.chat').append('<p><em>' + data + ' is typing</em></p>');
});