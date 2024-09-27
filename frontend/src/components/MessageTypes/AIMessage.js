import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardUser } from '@fortawesome/free-solid-svg-icons';

const AIMessage = ({ content }) => {
  const renderContent = () => {
    if (typeof content === 'string') {
      // Split the content by newline characters
      const parts = content.split('\n');
      return parts.map((part, index) => {
        if (part.startsWith('| ')) {
          // This is likely a table row
          const cells = part.split('|').filter(cell => cell.trim() !== '');
          return (
            <tr key={index}>
              {cells.map((cell, cellIndex) => (
                <td key={cellIndex} className="border px-4 py-2">{cell.trim()}</td>
              ))}
            </tr>
          );
        } else if (part.startsWith('**')) {
          // This is likely a header
          return <h3 key={index} className="font-bold mt-4 mb-2">{part.replace(/\*/g, '')}</h3>;
        } else {
          // Regular text
          return <p key={index} className="mb-2">{part}</p>;
        }
      });
    }
    return <p>{content}</p>;
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-2 mt-1">
          <FontAwesomeIcon icon={faChalkboardUser} className="text-gray-500" />
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-3 rounded-lg shadow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AIMessage;