import React, { useState } from 'react';
import { UserMessage } from './MessageTypes/MessageClasses';
import { useAppContext } from '../context/AppContext';

const MessageInput = ({sendSocketMessage}) => {
    const [message, setMessage] = useState('');
    const { addMessage }= useAppContext();

    const handleSubmit = (e) => {
      e.preventDefault();
      if (message.trim() === '') return; // Prevent sending empty messages
      
      console.log(message);
      const user_message = new UserMessage(message);
      addMessage(user_message);

      // Send through websocket to backend
      sendSocketMessage(JSON.stringify({ key: 'user_input', value: message }));

      // Reset the form
      setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center p-4 text-l">
          {/* {isUtteranceEnd && (
            <svg className='mx-2' width="40" height="40" viewBox="0 0 200 200">
              <circle
                className="speech_spinner"
                cx="100"
                cy="100"
                r="90"
                stroke="white"
                strokeWidth="10"
                fill="none"
              />
            </svg>
          )} */}
          <input
            name="userInput"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-2 mr-2 text-l text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:ring-blue-500"
          />
          {/* <button
            type="button"
            className={`px-4 py-2 mx-1 text-white rounded-lg ${isListening ? 'bg-blue-600 fade speech_glow' : 'bg-blue-500 hover:bg-blue-600'}`}
            onClick={(e) => switchListening(e)}
          >
            <FontAwesomeIcon icon={faMicrophone} className="mr-2" /> */}
            {/* {isListening ? 'Listening...' : 'Speak'}</button> */}
          <button
            type="submit"
            className="px-4 py-2 mx-1 text-white bg-green-500 rounded-lg hover:bg-blue-600"
          >
            <i className="fas fa-paper-plane"></i>
            {"Send"}
          </button>
        </form>
    );
}

export default MessageInput;