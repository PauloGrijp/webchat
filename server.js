const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT'], 
  },
});
require('./socket/socket')(io);
const { getAll, createMessage, updateMessage } = require('./controller/messages');

app.set('views', './views');

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(cors());

app.put('/update', updateMessage);
app.post('/create', createMessage);
app.get('/', getAll);

app.listen(PORT, () => console.log(`ouvindo porta ${PORT}!`));
module.exports = { io };