import React, { useRef, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import './MessageList.css';

import Message from '../../Components/Message/Message';
const Msg = React.memo(Message);

export default function MessageList(props) {
  const messages = props.messages;
  const isFirstRender = usePrevious(messages, []).length < 1;
  const list = useRef(null);

  useEffect(() => {
    const el = list.current.querySelector('.message-list__content>:last-child');

    if (!el) return;

    const top = el.getBoundingClientRect().top;
    const scrollHeight = list.current.clientHeight;
    const offset = top - scrollHeight;

    if (offset < 250) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    } else if (isFirstRender) {
      el.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  return (
    <div className="message-list" ref={list}>
      <TransitionGroup className="message-list__content">
        {messages.map(el => (
          <CSSTransition
            classNames={isFirstRender ? '' : 'appear'}
            timeout={{ enter: 300, exit: 0 }}
            key={el.id}>
            <Msg {...el} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
}

function usePrevious(value, defaultVal = null) {
  const ref = useRef(defaultVal);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
