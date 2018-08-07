var socket = io();

// Received this message if successed connect to server
socket.on('connect', function() {
    console.log('Connected to server')

    // emit create email after connect
    // socket.emit('createEmail', {
    //     to: 'jen@gm.com',
    //     text: 'hey this is andrew'
    // })
})

// received email from server that emit newEmail
socket.on('newMessage', function(message) {
    console.log('new Message', message)

    var li = jQuery('<li></li>')
    li.text(`${message.from}: ${message.text}`)

    jQuery("#messages").append(li)
})

// send location to client
var locationButton = jQuery('#send-location')
locationButton.on('click', function() {
    if(!navigator.geolocation) {
        return alert("Your browser not supported")
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function() {
        alert('unable fetch location')
    })
})

// Received this message if disconnect from server
socket.on('disconnect', function() {
    console.log('disconnected from server')
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