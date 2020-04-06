import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MessageEditor from './MessageEditor';

export const MESSAGES_URI = '/messages/api/v1/messages/';

export default function Messages(props) {
  const newMessage = { title: '', text: '' };
  const [message, setMessage] = useState(newMessage);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (props.user && messages.length === 0) {
      getMessages();
    }
  }, [props]);

  async function handleSave() {
    await axios.post(MESSAGES_URI, message);
    setMessage(newMessage);
  }

  async function getMessages() {
    const res = await axios.get(MESSAGES_URI);
    setMessages(res.data);
  }

  if (!props.user) {
    return (
      <section className="w-3/4 rounded bg-white shadow p-4">
        <div className="text-center">
          Please log in or sign up to start adding messages.
        </div>
      </section>
    );
  }

  return (
    <section className="w-3/4 rounded bg-white shadow p-4">
      <h2 className="font-bold text-lg">Messages</h2>
      <div className="flex">
        <MessageEditor
          className="mt-4 w-1/4"
          onSave={handleSave}
          message={message}
          onChangeMessage={setMessage}
        />
      </div>
    </section>
  );
}
