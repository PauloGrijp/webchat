const moment = require('moment');

let users = [];

const userDisconnect = (socket, io) => {
  socket.on('disconnect', () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit('users', users);
  });
};

const updateNickname = (socket, io) => {
  socket.on('update', (nickname) => {
    // AJUDA DO ZÓZIMO
    const userIndex = users.findIndex((user) => user.socketId === socket.id);
    users[userIndex].nickname = nickname;
    io.emit('users', users);
  });
};

const chat = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', ({ chatMessage, nickname }) => {
      const data = moment().format('DD-MM-YYYY HH:mm:ss');
      io.emit('message', `${data} - ${nickname}: ${chatMessage}`);
    });

    socket.on('login', (nickname) => {
      users.push({ nickname, socketId: socket.id });
      io.emit('users', users);
    });

    userDisconnect(socket, io);
    updateNickname(socket, io);
  });
};

module.exports = chat;