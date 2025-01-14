'use client';

import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import ReadBox from './ReadBox';

const Contact = ({ data }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="text-3xl mt-5 ml-4 font-bold">List of Messages</h1>
      <hr className="my-2 mx-9" />

      <div>
        {arrayHasData(data?.messages) ? (
          <div className="w-full">
            <p className="font-bold text-xl text-center">No messages found!</p>
          </div>
        ) : (
          data?.messages?.map((message) => {
            return (
              <div
                key={message?._id}
                className={`flex justify-between my-5 p-3 mx-2 border border-gray-300 rounded-lg hover:bg-blue-100 cursor-pointer ${message?.read && 'bg-gray-200'}`}
              >
                <div>
                  <h4
                    className={`text-md mt-2 ${message?.read === false && 'font-bold'}`}
                  >
                    {message?.from?.name}
                  </h4>
                  <p className="text-xs text-gray-500 italic mt-1">
                    {message?.from?.email}
                  </p>
                </div>
                <h4
                  className={`text-sm mt-2 ${message?.read === false && 'font-bold'}`}
                >
                  {message?.subject}
                </h4>
                <p
                  className={`text-sm mt-2 mr-4 ${message?.read === false && 'font-bold'}`}
                >
                  {message?.createdAt?.substring(0, 10)}
                </p>
                {message?.read === false && (
                  <ReadBox id={message?._id} readStatus={message?.read} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Contact;