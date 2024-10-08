import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const UserMessage = ({ content }) => (
  <div className="flex justify-end mb-4">
    <div className="flex items-center">
      <div
        className="flex items-left max-w-xs bg-gray-200 text-gray-800 p-3 rounded-xl"
      >
        <p className="text-m">{content}</p>
      </div>
      <div className="flex-shrink-0 ml-2">
        <FontAwesomeIcon icon={faUser} className="text-gray-500" />
      </div>
    </div>
  </div>
);

export default UserMessage;