var socket = io();

function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')

    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight()

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight)
    }
}

// Received this message if successed connect to server
socket.on('connect', function() {
    var params = jQuery.deparam(window.location.search)

    // third parameter is callback
    socket.emit('join', params, function(err) {
        if(err) {
            alert("name and room are required")
            window.location.href = "/"
        } else {
            console.log("no error")
        }
    })
})

// Received this message if disconnect from server
socket.on('disconnect', function() {
    console.log('disconnected from server')
})

socket.on('updateUserList', function(users) {
    var ol = jQuery('<ol></ol>')

    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user))
    })

    jQuery('#users').html(ol)
})

// received email from server that emit newEmail
socket.on('newMessage', function(message) {
    console.log('new Message', message)
    var formattedTime = moment(message.createdAt)
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    })

    jQuery('#messages').append(html)

    scrollToBottom()
})

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt)
    var li = jQuery('<li></li>')
    li.text(`${message.from} ${formattedTime}: ${message.text}`)
    jQuery("#messages").append(li)
})

// send location to client
var locationButton = jQuery('#send-location')
locationButton.on('click', function() {
    if(!navigator.geolocation) {
        return alert("Your browser not supported")
    }

    locationButton.attr('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function() {
        alert('unable fetch location')
    })
})




jQuery('#message-form').on('submit', function(e) {
    e.preventDefault()
    socket.emit("createMessage", {
        from: "jquery client",
        text: jQuery('[name=message]').val()
    }, function(data) {
        console.log('Got it ', data)
    })
})