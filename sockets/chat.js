//
let nicknames = [];

const nickOnLogin = (nickname, io, socket) => {
  nicknames.push({ id: socket.id, nickname });
  const onlyNicknames = nicknames.map(({ nickname: nick }) => nick);
  io.emit('updateNicknames', onlyNicknames);
};

const changeNicknames = (oldNick, newNick, io, socket) => {
  nicknames = nicknames.map(({ nickname, id }) => {
    if (oldNick === nickname && id === socket.id) {
      return { nickname: newNick, id };
    }
      return { nickname, id };
  });
  const onlyNicknames = nicknames.map(({ nickname: nick }) => nick);
  io.emit('updateNicknames', onlyNicknames);
};

const sendMsg = (chatMessage, nickname, io) => {
  const formatMsg = {
    date: new Date().toLocaleString('en-US').replaceAll('/', '-').replace(',', ''),
    chatMessage,
    nickname,
  };
  io.emit('message', `${formatMsg.date} - ${formatMsg.nickname}: ${formatMsg.chatMessage}`);
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('userLogin', (username) => {
    if (!username) return false;
    nickOnLogin(username, io, socket);

    socket.emit('userConnect', username);

    socket.emit('serverMessage', `Bem vindo ${username} ao chat`);

    socket.broadcast.emit('serverMessage', `${username} acabou de entrar na sala`);
  });

  socket.on('changeNicknames', 
    ({ oldNick, newNick }) => changeNicknames(oldNick, newNick, io, socket));

  socket.on('message', ({ nickname, chatMessage }) => {
    sendMsg(chatMessage, nickname, io); 
});
});
