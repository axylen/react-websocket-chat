import React, { useState, useEffect } from 'react';
import './Chat.css';

import Container from '../Container/Container';
import Header from '../../Components/Header/Header';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../../Components/MessageInput/MessageInput';

export default function Chat(props) {
  const { socket, logout, user, userCount } = props;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  function addMessage(message) {
    setMessages(m => [...m, message]);
  }

  function handleSendMessage(e) {
    e.preventDefault();

    if (text === '') return;

    const newMessage = {
      text,
    };

    setText('');

    socket.emit('message', newMessage);

    newMessage.owner = true;
    newMessage.user = user;
    newMessage.date = new Date();
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
    <div className="chat-wrapper">
      <Header logout={logout} userCount={userCount} />
      <Container className="chat-container">
        <MessageList messages={messages} />
        <MessageInput
          text={text}
          setText={setText}
          sendMessage={handleSendMessage}
        />
      </Container>
    </div>
  );
}
