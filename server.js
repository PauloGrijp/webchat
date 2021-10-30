const express = require('express');
require('dotenv').config();

const { PORT } = process.env || 3000;

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: `http//localhost:${PORT}`,
    methods: ['GET', 'POST'], 
  },
});
require('./src/sockets/messages')(io);
require('./src/sockets/users')(io);

const messagesController = require('./controllers/messagesController');

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.get('/', messagesController.GetHistoricMessages);

http.listen(3000, () => {
  console.log('Server on: port 3000');
});
