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

// server
server.listen(port, () => {
  console.log(`Port running on localhost:${port}`);
});


