import axios from 'axios';
import React, { useState } from 'react';
import MessageEditor from './MessageEditor';

export default function Messages() {
  const newMessage = { title: '', text: '' };
  const [message, setMessage] = useState(newMessage);

  async function handleSave() {
    const res = await axios.post('/messages/api/v1/messages/', message);
    console.log(res);
    setMessage(newMessage);
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
