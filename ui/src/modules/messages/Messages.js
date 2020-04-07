import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MessageCard from './MessageCard';
import MessageEditor from './MessageEditor';

export const MESSAGES_URI = '/messages/api/v1/messages/';

export default function Messages(props) {
  const newMessage = { title: '', text: '' };
  const [message, setMessage] = useState(newMessage);
  const [messages, setMessages] = useState(null);
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
    setMessages(res.data);
    setIsLoading(false);
  }

  function handleChangeMessage() {}

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
      <h2 className='font-bold text-lg'>Messages</h2>
      <div className='flex flex-col'>
        <MessageEditor
          className='mt-4 w-1/4'
          onSave={handleSave}
          message={message}
          onChangeMessage={setMessage}
        />
        <div className='flex mt-4'>
          {messages &&
            messages.map((message, index) => {
              return (
                <div className='w-1/4 pr-2' key={`message-card-${index}`}>
                  <MessageCard
                    message={message}
                    getMessages={getMessages}
                    onChangeMessage={handleChangeMessage}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
