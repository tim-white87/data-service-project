import { Auth } from 'aws-amplify';
import React from 'react';
import { Link } from 'react-router-dom';

export default function PageHeader(props) {
  return (
    <section className="w-full shadow bg-white flex justify-between">
      <h2 className="text-lg mr-4 self-center ml-6 w-1/6">
        Data Service Project
      </h2>
      <nav className="flex justify-between text-sm h-12 w-full">
        <ul className="flex">
          <li className="mr-4 hover:bg-blue-200 h-full flex px-4 items-center">
            <Link to="/" className="text-blue-600">
              Messages
            </Link>
          </li>
          <li className="mr-4 hover:bg-blue-200 h-full flex px-4 items-center">
            <Link to="/about" className="text-blue-600">
              About
            </Link>
          </li>
        </ul>
        <ul className="flex">
          {!props.user ? (
            <li className="mr-4 hover:bg-blue-200 h-full flex px-4 items-center">
              <button
                onClick={() => Auth.federatedSignIn()}
                className="text-blue-600"
              >
                Login / Sign Up
              </button>
            </li>
          ) : (
            <>
              <li className="mr-4 h-full flex px-4 items-center">
                Welcome, {props.user.getUsername()}
              </li>
              <li className="mr-4 hover:bg-blue-200 h-full flex px-4 items-center">
                <button
                  onClick={() => Auth.signOut()}
                  className="text-blue-600"
                >
                  Log out
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </section>
  );
}
