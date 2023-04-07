// require
const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes');
require('dotenv').config();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', './views')
app.set('view engine', 'ejs');
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
app.use('/api', routes);
app.use('/uploads', express.static('uploads')); //serve avatar path from Users database
app.use('/api/chat', express.static('public')); 

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.error || err.message || 'Internal server error'
  return res.status(status).json({
    status: status,
    message: 'Error',
    error: error 
  })
})

// Chat
const rooms = { 'room-one' : { users : {}}, 'room-two' : { users : {}} }

app.get('/api/chat', (req, res) => {
    res.render('index', { rooms: rooms })
})

app.get('/api/chat/:room', (req, res) => {
    const { room } = req.params
    if(rooms[room] == null) {
        return res.redirect('/api/chat')
    }
    res.render('chatroom', { roomName: req.params.room })
})

io.on('connection', (socket) => {
    socket.on('newUser', (room, name) => {
        socket.join(room)
        rooms[room].users[socket.id] = name 
        socket.to(room).emit('userConnected', name)
    })
  
    socket.on('sendChatMessage', (room, message) => {
        // insert chat messages into db
        io.to(room).emit('chatMessage', {message: message, name: rooms[room].users[socket.id]})
    })
  
    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room => {
            socket.to(room).emit('userDisconnected', rooms[room].users[socket.id])
            delete rooms[room].users[socket.id]
        })
    })
})

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if(room.users[socket.id] != null) 
            names.push(name)
        return names 
    }, [])
}

// server
server.listen(port, () => {
  console.log(`Port running on localhost:${port}`);
});
