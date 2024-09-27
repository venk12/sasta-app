import React, { createContext, useContext, useState, useEffect } from 'react';
import ChatManager from '../managers/ChatManager';
import useWebSocket from '../hooks/useWebSocket';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [chatManager] = useState(new ChatManager());
  const [messages, setMessages] = useState([]); // Add this line
  const [messageUpdateTrigger, setMessageUpdateTrigger] = useState(0); 


  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const addMessage = (sender, content) => {
    console.log("add message triggered");
    const newMessage = chatManager.addMessage(sender, content);
    setMessages([...chatManager.getMessages()]);
    setMessageUpdateTrigger(prev => prev + 1); // Add this line
    console.log(chatManager.getMessages());
  };

  const getMessages = () => messages;

//  This can be uncommented if you want to use SampleMessages  
//  const getSampleMessages = () => chatManager.getSampleMessages()

// This can be used later when you are designing multiple scenarios and you want to clear the chat
  const clearMessages = () => {
    chatManager.clearMessages();
    setMessages([]); // Add this line
  };

  return (
    <AppContext.Provider value={{ 
      darkMode, 
      toggleDarkMode, 
      addMessage,
      getMessages,
    //   clearMessages,
      messageUpdateTrigger
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;