import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import MessageCard from './MessageCard';
import MessageEditor from './MessageEditor';

export const MESSAGES_URI = '/messages/api/v1/messages/';

export default function Messages(props) {
  const newMessage = { title: '', text: '' };
  const [message, setMessage] = useState(newMessage);
  const [messages, setMessages] = useReducer((state, action) => {
    switch (action.type) {
      case 'update':
        return state.map((item, i) =>
          i === action.index ? action.value : item
        );
      default:
        return action.value;
    }
  }, null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.user && !messages) {
      getMessages();
    }
    setIsLoading(false);
  }, [props, messages]);

  async function handleSave() {
    await axios.post(MESSAGES_URI, message);
    setMessage(newMessage);
    await getMessages();
  }

  async function getMessages() {
    setIsLoading(true);
    const res = await axios.get(MESSAGES_URI);
    setMessages({ value: res.data });
    setIsLoading(false);
  }

  function handleChangeMessage(message, index) {
    setMessages({ type: 'update', value: message, index });
  }

  if (isLoading) {
    return (
      <section className='w-3/4 rounded bg-white shadow p-4'>
        <div className='text-center'>Loading...</div>
      </section>
    );
  }

  if (!props.user) {
    return (
      <section className='w-3/4 rounded bg-white shadow p-4'>
        <div className='text-center'>
          Please log in or sign up to start adding messages.
        </div>
      </section>
    );
  }

  return (
    <section className='w-3/4 rounded bg-white shadow p-4'>
      <h2 className='font-bold text-lg text-blue-700'>Enter New Message:</h2>
      <div className='flex flex-col'>
        <MessageEditor
          className='mt-4 w-1/4'
          onSave={handleSave}
          message={message}
          onChangeMessage={setMessage}
        />
        <h2 className='font-bold text-lg mt-4 text-blue-700'>Messages:</h2>
        <div className='flex mt-4'>
          {messages &&
            messages.map((message, index) => {
              return (
                <div className='w-1/4 pr-2' key={`message-card-${index}`}>
                  <MessageCard
                    message={message}
                    getMessages={getMessages}
                    onChangeMessage={handleChangeMessage}
                    index={index}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
