

$(document).ready(function () {
    //
    dem = 0;
    profile = {

    }
    // ----------Main js
    $('.form-signin ').show();
    $('.container-fluid').hide();

    $('#Signin').click(function () {
        socket.emit("clientSendUserName", $('#inputName').val());
        $('#inputName').val('');

    });

    $('#inputName').keypress(function (e) {
        if (e.which == 13) {
            $('#Signin').click();
            $('#Signin').click();
            event.preventDefault();
        }
    })




    $('#logout').click(function () {
        socket.emit("logoutUserName", profile.Name);
        socket.emit("logoutUserName");

        $('.form-signin ').show();
        $('.container-fluid').hide();
    })

    $('#btn-chat').click(function () {
        var data = $('#content-message').val();
        if ($('#content-message').val()) {
            var message = '<div class="chat-bubble me">' +
                '<div class="my-mouth"></div>' +
                '<div class="content" >' + data + '</div>' +
                '<div class="time">9:60</div>' +
                '</div>'
            $('.chat').append(message)
        }

        socket.emit("Send-message", $('#content-message').val())
        $('#content-message').val('');
        dem = 0;

    });

    $('#content-message').keypress(function (e) {

        if (e.which == 13) {
            $('#btn-chat').click();
            $('#btn-chat').click();
            return false;
        }
        dem++;
        socket.emit('typing', dem);

    });


    $("input[type='password'][data-eye]").each(function (i) {
        var $this = $(this);

        $this.wrap($("<div/>", {
            style: 'position:relative'
        }));
        $this.css({
            paddingRight: 60
        });
        $this.after($("<div/>", {
            html: 'Show',
            class: 'btn btn-primary btn-sm',
            id: 'passeye-toggle-' + i,
            style: 'position:absolute;right:10px;top:50%;transform:translate(0,-50%);-webkit-transform:translate(0,-50%);-o-transform:translate(0,-50%);padding: 2px 7px;font-size:12px;cursor:pointer;'
        }));
        $this.after($("<input/>", {
            type: 'hidden',
            id: 'passeye-' + i
        }));
        $this.on("keyup paste", function () {
            $("#passeye-" + i).val($(this).val());
        });
        $("#passeye-toggle-" + i).on("click", function () {
            if ($this.hasClass("show")) {
                $this.attr('type', 'password');
                $this.removeClass("show");
                $(this).removeClass("btn-outline-primary");
            } else {
                $this.attr('type', 'text');
                $this.val($("#passeye-" + i).val());
                $this.addClass("show");
                $(this).addClass("btn-outline-primary");
            }
        });
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
    $('#UserName span').text(data);
    profile.Name = data;
});

socket.on("ServerSendListUser", function (data) {
    $('.contact-list').html('');
    data.forEach(function (item) {
        if (item !== profile.Name) {
            var NameUser = '<div class="contact">' +
                ' <img src="StoreImg/images.png" alt="profilpicture">' +
                '<div class="contact-preview">' +
                ' <div class="con   tact-text">' +
                '   <h1 class="font-name"><b>' + item + '</b></h1>' +
                ' </div>' +
                '</div>' +
                '<div class="contact-time">' +
                '<p>9:38</p>' +
                '</div>' +
                '</div>'

            $('.contact-list').append(NameUser);
        }
    });
});

socket.on("Send-message", function (data) {
    $('.chat p').text('');
    var message = '<div class="chat-bubble you">' +
        '<div class="your-mouth"></div>' +
        '<div class="content" ><b>' + data.Name + ': </b>' + data.content + '</div>' +
        '<div class="time">9:60</div>' +
        '</div>'
    $('.chat').append(message)
});

socket.on('typing', function (data) {
    $('.chat').append('<p><em>' + data.Name + ' is typing</em></p>');
});

//Handle Logout
socket.on('Handle-logout', function (data) {
    $('.chat').append('<div style="text-align:center;"><em>' + data + ' has left</em></p>');
})
