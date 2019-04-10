import React from 'react';
import './Message.css';

export default function Message(props) {
  const { user, text, owner, type } = props;
  const date = props.date ? new Date(props.date) : new Date();
  let className = 'message';

  if (owner) className += ' message--owner';

  if (type === 'info')
    return <div className={className + ' message--notify'}>{text}</div>;

  return (
    <div className={className}>
      <div className="message__info">
        <span className="message__userinfo">{user}</span>
        <span>{date.toLocaleTimeString()}</span>
      </div>
      <div className="message__text">{text}</div>
    </div>
  );
}
