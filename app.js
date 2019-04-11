const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/build'));

const messages = []; // {userId, text, date, type(message, info), id}

const users = {}; // { online, user }

server.listen(8080);

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
});

function getOnlineUsers() {
  const arr = [];
  for (let id in users) {
    if (users[id].online) arr.push(users[id]);
  }
  return arr;
}

function getMessages(count = messages.length) {
  if (messages.length <= count) return messages.slice();

  return messages.slice(messages.length - count, messages.length);
}

function addMessage(socket, msg) {
  msg.date = new Date();
  msg.id = messages.length;

  messages.push(msg);

  socket.broadcast.emit('message', buildMessage(msg));
}

// {User, UserId, Text, Type, Date, id}
function buildMessage(msg) {
  return {
    ...msg,
    user: users[msg.userId] ? users[msg.userId].user : 'Аноним',
  };
}

io.on('connection', socket => {
  socket.emit('user:updatecount', getOnlineUsers().length);

  socket.on('user:connect', data => onUserConnect(socket, data));

  socket.on('disconnect', () => onUserDisconnect(socket));
  socket.on('user:disconnect', () => onUserDisconnect(socket));

  socket.on('message', msg => onReceiveMessage(socket, msg));
});

function onUserConnect(socket, data) {
  const user = data.user;
  const userId = socket.id;

  users[userId] = {
    online: true,
    user,
  };

  io.emit('user:updatecount', getOnlineUsers().length);

  addMessage(socket, {
    userId: userId,
    text: `Пользователь ${user} подключился`,
    type: 'info',
  });

  socket.emit('user:connect', getMessages(100).map(buildMessage));
}

function onReceiveMessage(socket, msg) {
  addMessage(socket, {
    ...msg,
    type: 'message',
    userId: socket.id,
  });
}

function onUserDisconnect(socket) {
  const userId = socket.id;
  if (!users[userId] || users[userId].online === false) return;

  users[userId].online = false;

  io.emit('user:updatecount', getOnlineUsers().length);

  addMessage(socket, {
    userId: userId,
    text: `Пользователь ${users[userId].user} вышел`,
    type: 'info',
  });
}
