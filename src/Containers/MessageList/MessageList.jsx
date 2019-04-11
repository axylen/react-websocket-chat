import React, { useRef, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import './MessageList.css';

import Message from '../../Components/Message/Message';
const Msg = React.memo(Message);

export default function MessageList(props) {
  const messages = props.messages;
  const bottom = useRef(null);

  useEffect(() => {
    if (bottom.current) bottom.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-list">
      <TransitionGroup className="message-list__content">
        {messages.map(el => (
          <CSSTransition
            classNames='appear'
            timeout={{enter: 300, exit: 0}}
            key={el.id}>
            <Msg {...el} />
          </CSSTransition>
        ))}
      </TransitionGroup>
      <div ref={bottom} />
    </div>
  );
}
