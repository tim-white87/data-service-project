import React, { useState } from 'react';

function MessageEditor(props) {
  return (
    <section className={props.className}>
      <input
        className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
        placeholder="Enter message title"
        value={props.message.title}
        onChange={(val) =>
          props.onChangeMessage({ ...props.message, title: val.target.value })
        }
      ></input>
      <textarea
        className="mt-2 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
        placeholder="Enter message text"
        value={props.message.text}
        onChange={(val) =>
          props.onChangeMessage({ ...props.message, text: val.target.value })
        }
      ></textarea>
      <div className="mt-2 flex justify-between">
        <button className=" bg-white hover:bg-blue-200 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block text-blue-500 appearance-none leading-normal">
          Clear
        </button>
        <button
          onClick={props.onSave}
          className=" bg-blue-500 hover:bg-blue-300 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block text-white appearance-none leading-normal"
        >
          Save
        </button>
      </div>
    </section>
  );
}

export default function Messages() {
  const newMessage = { title: '', text: '' };
  const [message, setMessage] = useState(newMessage);

  function handleSave() {
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
