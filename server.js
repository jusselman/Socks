const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utilities/message');
const {
    joinUser,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utilities/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder //
app.use(express.static(path.join(__dirname, 'public')));

const admin = 'Admin';

//run when client connects //
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = joinUser(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user //
        socket.emit('message', formatMessage(admin, 'Welcome to the Socks-Chat'));

        //  Broadcast to everybody except client connecting //
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(admin, `${user.username} has joined ${user.room}`));

        // Send users and room info //
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });






    // Listen for chatMessage //
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Run when client disconnects, and yes, must be in connection //
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit(
                'message', formatMessage(admin, `${user.username} has left chat`));
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));