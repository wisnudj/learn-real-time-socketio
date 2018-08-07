var socket = io();

// Received this message if successed connect to server
socket.on('connect', function() {
    console.log('Connected to server')

    // emit create email after connect
    socket.emit('createEmail', {
        to: 'jen@gm.com',
        text: 'hey this is andrew'
    })
})

// received email from server that emit newEmail
socket.on('newEmail', function(email) {
    console.log('new email', email)
})

// Received this message if disconnect from server
socket.on('disconnect', function() {
    console.log('disconnected from server')
})