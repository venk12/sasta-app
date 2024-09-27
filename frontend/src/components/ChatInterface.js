import React, { useContext, useEffect, useState, useRef} from 'react';
import { AppContext } from '../context/AppContext';
import MessageList from './MessageTypes/MessageList';
import MessageInput from './MessageInput'
import { UserMessage, AIMessage } from './MessageTypes/MessageClasses';

const ChatInterface = ({sendSocketMessage}) => {
  const { getMessages, addMessage, darkMode, messageUpdateTrigger } = useContext(AppContext);
  const messageListRef = useRef(null);

  const [messages, setMessages] = useState(getMessages());

  useEffect(() => {
    setMessages(getMessages());
  }, [messageUpdateTrigger, getMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const getLastAIMessage = () => {
    const messages = getMessages();
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i] instanceof AIMessage) {
        return messages[i];
      }
    }
    return null;
  };

  const handleNotUnderstanding = () => {
    // const message = "I'm not understanding. Can you please clarify or rephrase?";
    sendSocketMessage(JSON.stringify({ key: "user_no_comprehension", value: getLastAIMessage().content }));
  };

  const handleNotAbleToRespond = () => {
    // const message = "I'm not able to respond to that. Can you try asking something else?";
    sendSocketMessage(JSON.stringify({ key: "user_no_formation", value: getLastAIMessage().content }));
  };

  //   const handleNewMessage = (sender, content) => {
  //     addMessage(sender, content);
  //   };

  return (
    <>
    <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
      <div className={`pt-20 w-1/2 px-2 h-full rounded-lg overflow-hidden flex flex-col ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
        <div ref={messageListRef} className="flex-grow overflow-y-auto stylish-scrollbar">
          <MessageList messages={messages} />
        </div>
        
        {/* <div className="flex justify-center space-x-4 mb-4">
          <button 
            onClick={handleNotUnderstanding}
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-400'} text-white`}>
            Not understanding
          </button>
          <button 
            onClick={handleNotAbleToRespond}
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-yellow-700 hover:bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-400'} text-white`}>
            Not able to respond
          </button>
        </div> */}
        
        <MessageInput sendSocketMessage={sendSocketMessage}/>
      </div>
    </div>
    {/* Tried to move to app.css, but it is not working properly. find a way to move this later! */}
    <style jsx>{`
      .stylish-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .stylish-scrollbar::-webkit-scrollbar-track {
        background: ${darkMode ? '#2D3748' : '#E2E8F0'};
        border-radius: 10px;
      }
      .stylish-scrollbar::-webkit-scrollbar-thumb {
        background: ${darkMode ? '#4A5568' : '#CBD5E0'};
        border-radius: 10px;
      }
      .stylish-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${darkMode ? '#718096' : '#A0AEC0'};
      }
    `}</style>
    </>
  );
};

export default ChatInterface;