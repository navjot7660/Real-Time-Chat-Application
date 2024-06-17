//node server which will handle socket io connections
const io = require('socket.io')(4000, {
    cors: {
        origin: '*',
    }
});
const users = {};

io.on('connection', socket => {
    console.log('New connection:', socket.id); // Log new connections

    socket.on('new-user-joined', name => {
        console.log('New user joined:', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        console.log('Message received:', message); // Log received messages
        console.log('From user:', users[socket.id]); // Log user sending the message
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id); // Log user disconnections
        const name = users[socket.id];
        delete users[socket.id];
        socket.broadcast.emit('left', name);
    });
});

console.log('Server is running on port 4000');
