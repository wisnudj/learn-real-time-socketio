const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { isRealString } = require('./utils/validation.js')
const { Users } = require('./utils/users.js')

const publicPath = path.join(__dirname, '../public')
var app = express()
var server = http.createServer(app)
app.use(express.static(publicPath))
var io = socketIO(server)
var users = new Users()

/* 
    io is group socket
    socket is one connected socket
*/

io.on('connection', (socket) => {
    console.log('new user connected')

     socket.on('join', (params, callback) => {
         if(!isRealString(params.name) || !isRealString(params.room)) {
             callback("name and room are required")
         }

         /*
            socket join to room
            first parameter: room name
         */

        socket.join(params.room)
        // socket.leave(name_room)

        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room)

        /*
            io.emit                 ----> io.to(room_name).emit
            socket.broadcast.emit   ----> socket.broadcast.to(room_name).emit
            socket.emit
        */


        io.to(params.room).emit('updateUserList', users.getUserList(params.room))

        /*
            this will send message to only one socket that is sender
        */
        socket.emit('newMessage', {
            from: 'Admin',
            text: 'welcome to the user connected'
        })

        /* 
            it will send message to all connection socket in same room except sender.
            it can be use to tell other client in room that new person connection
        */
        socket.broadcast.to(params.room).emit('newMessage', {
            from: 'Admin',
            text: `${params.name} has join`
        })

        callback();
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

        var user = users.getUser(socket.id)

        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', { 
                from: user.name,
                text: message.text
            })
        }
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

        var user = users.removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', { from: "admin", text: `${user.name} has left room` })
        }
    })
})

server.listen(3000, () => {
    console.log("Server is on port 3000")
})