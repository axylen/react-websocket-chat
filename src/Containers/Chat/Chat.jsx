import React, { useState, useEffect } from 'react';
import './Chat.css';

import Container from '../Container/Container';
import Header from '../../Components/Header/Header';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../../Components/MessageInput/MessageInput';

export default function Chat(props) {
  const { socket, logout, user, userCount } = props;
  const [messages, setMessages] = useState([]);

  function addMessage(message) {
    setMessages(m => {
      if (m.length < 100) return [...m, message];

      return [...m.slice(m.length - 99, m.length), message];
    });
  }

  function handleSendMessage(text) {
    const newMessage = {
      text,
    };

    socket.emit('message', newMessage);

    newMessage.owner = true;
    newMessage.user = user;
    newMessage.userId = socket.id;
    newMessage.date = new Date();
    newMessage.id = messages[messages.length - 1].id + 1;
    addMessage(newMessage);
  }

  useEffect(() => {
    if (!socket) return;
    socket.on('message', data => addMessage(data));
    socket.on('user:connect', data => setMessages(data));

    return () => {
      socket.off('message');
      socket.off('user:connect');
    };
  }, [socket]);

  return (
    <>
      <Header logout={logout} userCount={userCount} />
      <Container className="chat-container">
        <MessageList messages={messages} />
        <MessageInput sendMessage={handleSendMessage} />
      </Container>
    </>
  );
}
