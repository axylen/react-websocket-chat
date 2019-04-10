import React, { useState } from 'react';
import './MessageInput.css';

export default function MessageInput(props) {
  const { sendMessage } = props;
  const [text, setText] = useState('');

  function handleSubmin(e) {
    e.preventDefault();

    if (text === '') return;

    sendMessage(text);
    setText('');
  }

  return (
    <form onSubmit={handleSubmin} className="message-input__form">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        className="input-text"
        placeholder="Написать сообщение"
      />
    </form>
  );
}
