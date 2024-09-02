const express = require('express')
const path = require('path')
const app = express()  // app tanımlanıyor
const PORT = process.env.PORT ||4000 //400 PORT TANIMLANIYOR   
const server = app.listen(PORT, () => console.log(`Chat Server on Port ${PORT}`)); // SERVER PORTU DINLIYOR
const io = require('socket.io')(server)


app.use(express.static(path.join(__dirname, 'public'))) // ortak bir path oluşturduk ve birleştirdik
let socketsConnected = new Set()
io.on('connect', onConnected)

function onConnected(socket) {
    console.log('Socket connected',socket.id)
    socketsConnected.add(socket.id)

    io.emit('client-total', socketsConnected.size)

    socket.on('disconnect', () =>{
        console.log('Socket disconnected', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('client-total', socketsConnected.size)
    })

    socket.on('message', (data) => {
       //console.log(data)
        socket.broadcast.emit('chat-message', data)
    })
    

}