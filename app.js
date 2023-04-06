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

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.error || err.message || 'Internal server error'
  return res.status(status).json({
    status: status,
    error: error 
  })
})

// Chat
const rooms = { name: {} }

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

app.post('/api/chat/room', (req, res) => {
    const { room } = req.body
    if(rooms[room] != null) {
        return res.redirect('/api/chat')
    }
    rooms[room] = { users: {} }
    res.redirect(`/api/chat/${room}`)
    // send message that new room created
})

io.on('connection', (socket) => {
    // console.log(socket.adapter.rooms);
    console.log(`a user connected with id ${socket.id}`);
  
    socket.on('chat message', (msg) => {
        // console.log(`message: ${msg}`);
        socket.broadcast.emit('new chat', msg)
    })
  
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})

// server
server.listen(port, () => {
  console.log(`Port running on localhost:${port}`);
});
