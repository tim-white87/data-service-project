import axios from 'axios';
import React, { useState } from 'react';
import MessageEditor from './MessageEditor';
import { MESSAGES_URI } from './Messages';

export default function MessageCard(props) {
  const [isEditing, setIsEditing] = useState(false);

  function onClickEdit() {
    setIsEditing(true);
  }

  async function onClickDelete() {
    const res = await axios.delete(`${MESSAGES_URI}${props.message.key}`);
  }

  function handleSave() {
    setIsEditing(false);
  }

  function handleChangeMessage() {}

  if (isEditing) {
    return (
      <MessageEditor
        onSave={handleSave}
        message={props.message}
        onChangeMessage={handleChangeMessage}
      />
    );
  }

  return (
    <section className='p-4 rounded border shadow'>
      <h4 className='bold text-gray-700 text-lg'>
        {props.message ? props.message.title : 'Untitled'}
      </h4>
      <p className='mt-2 text-sm'>
        {props.message ? props.message.text : null}
      </p>
      <div className='mt-4 flex justify-between'>
        <button
          className='bg-white hover:bg-blue-200 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block text-blue-500 appearance-none leading-normal'
          onClick={onClickDelete}
        >
          Delete
        </button>
        <button
          onClick={onClickEdit}
          className=' bg-blue-500 hover:bg-blue-300 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block text-white appearance-none leading-normal'
        >
          Edit
        </button>
      </div>
    </section>
  );
}
