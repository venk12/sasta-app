import React from 'react';
import UserMessage from './UserMessage';
import AIMessage from './AIMessage';
// import HelperMessage from './HelperMessage';

import HelperFormation from './HelperFormation';
import HelperComprehension from './HelperComprehension';

import HouseKeeper from './HouseKeeper';

const MessageList = ({ messages }) => (
  <div className="flex-1 p-4 overflow-y-auto">
    {messages.map((msg, index) => {
      if (msg.sender === 'User') {
        return <UserMessage key={index} content={msg.content} />;
      } else if (msg.sender === 'AI') {
        return <AIMessage key={index} content={msg.content} />;
      } else if (msg.sender === 'Helper_Comprehension') {
        return <HelperComprehension key={index} vocabulary={msg.vocabulary} />;
      } else if (msg.sender === 'Helper_Formation') {
        return <HelperFormation key={index} potential_answers={msg.potential_answers} />;
      } else if (msg.sender === 'Housekeeper'){
        return <HouseKeeper key={index} content={msg.content}/>
      }
      return null;
    })}
  </div>
);

export default MessageList;