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

    socket.emit("newEmail", {
        from: "jaya@gm.com",
        text: "Hai from server",
        createdAt: 123
    })

    socket.on("createEmail", (newEmail) => {
        console.log("createEmail", newEmail)
    })

    socket.on('disconnect', () => {
        console.log("User telah disconnect")
    })
})

server.listen(3000, () => {
    console.log("Server is on port 3000")
})