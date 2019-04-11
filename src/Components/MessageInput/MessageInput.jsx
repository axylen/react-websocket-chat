import React, { useState } from 'react';
import './MessageInput.css';

export default function MessageInput(props) {
  const { sendMessage } = props;
  const [text, setText] = useState('');

  function handleSubmin(e) {
    e.preventDefault();

    const newText = text.trim();

    if (newText === '') return;

    sendMessage(newText);
    setText('');
  }

  return (
    <form onSubmit={handleSubmin} className="message-input__form">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        className="input-text"
        placeholder="Написать сообщение"
        maxLength="500"
        autoFocus
      />
    </form>
  );
}
