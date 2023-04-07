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
    error: error 
  })
})

// Chat
const rooms = {}

app.get('/api/chat', (req, res) => {
    const { Users } = require('./models')
    Users.findAll({ where: {role: 'admin'} })
    .then(user => {
        if(!user) {
            res.status(400).json({
                status: 400,
                message: 'There is no user with admin role yet',
                data: null
            })
        }
        user.forEach(v => {
            rooms[v.name] = { users: {} }
        })
        console.log(rooms);
        // console.log(rooms['gilang'].users);
        res.render('index', { rooms: rooms })
    }).catch(err => console.log(err))

    // create new room (for admin) when user starts chat with admin
})

app.get('/api/chat/:room', (req, res) => {
    const { room } = req.params
    if(rooms[room] == null) {
        return res.redirect('/api/chat')
    }
    res.render('user-chatroom', { roomName: req.params.room })
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
    socket.on('newUser', (room, name) => {
        // console.log(`room: ${room} user: ${name}`);
        socket.join(room)
        rooms[room].users[socket.id] = name 
        socket.to(room).emit('userConnected', name)
    })
  
    socket.on('sendChatMessage', (room, message) => {
        io.to(room).emit('chatMessage', {message: message, name: rooms[room].users[socket.id]})
    })
  
    socket.on('disconnect', () => {
        // console.log('user disconnected');
        getUserRooms(socket).forEach(room => {
            console.log(`room: ${room}`);
            socket.broadcast.emit('userDisconnected', rooms[room].users[socket.id])
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
