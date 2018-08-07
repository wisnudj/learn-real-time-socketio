const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
var app = express()
var server = http.createServer(app)
app.use(express.static(publicPath))
var io = socketIO(server)

/* 
    io is group socket
    socket is one connected socket
*/

io.on('connection', (socket) => {
    console.log('new user connected')

    /*
        this will send message to only one socket that is sender
    */
     socket.emit('newMessage', {
         from: 'Admin',
         text: 'welcome to the user connected'
     })

    /* 
        it will send message to all connection socket except sender.
        it can be use to tell other client that new person connection
    */
     socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: '1 user has connected'
     })

    socket.on("createEmail", (newEmail) => {
        console.log("createEmail", newEmail)

        //emit new Message to all socket because io is group socket
        // io.emit('newMessage', {
        //     from: newEmail.from,
        //     text: newEmail.text,
        //     createdAt: new Date().getTime()
        // })

        /*
            emit new message to 1 socket client. so when client send message via create email 
            and then server will emit newMessage to 1 client only
        */
        // socket.emit('newMessage', {
        //     from: newEmail.from,
        //     text: newEmail.text,
        //     createdAt: new Date().getTime()
        // })
        

        /*  
            or you can use socket broadcast emit,
            if you use socket.broadcast.emit all client will
            received except sender
        */
        socket.broadcast.emit('newMessage', {
            from: newEmail.from,
            text: newEmail.text,
            createdAt: new Date().getTime()
        })
    })

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message)
        io.emit('newMessage', { 
            from: message.from,
            text: message.text
        })
        // passing callback
        callback("this is from server");
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', {
            from: 'Admin',
            text: `${coords.latitude}, ${coords.longitude}`
        })
    })

    socket.on('disconnect', () => {
        console.log("User telah disconnect")
    })
})

server.listen(3000, () => {
    console.log("Server is on port 3000")
})