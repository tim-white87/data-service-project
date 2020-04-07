import React from 'react';

export default function MessageCard(props) {
  return (
    <section className='p-4 rounded border shadow'>
      <h4 className='bold text-gray-700 text-lg'>
        {props.message ? props.message.title : 'Untitled'}
      </h4>
      <p className='mt-2 text-sm'>
        {props.message ? props.message.text : null}
      </p>
    </section>
  );
}
