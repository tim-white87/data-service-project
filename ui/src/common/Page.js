import React from 'react';
import PageHeader from './PageHeader';

export default function Page(props) {
  return (
    <section className="bg-gray-200">
      <PageHeader {...props}></PageHeader>
      <div className="flex justify-center p-4 mt-10">{props.children}</div>
    </section>
  );
}
