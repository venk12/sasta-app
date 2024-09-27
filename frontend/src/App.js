import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import AppContextProvider, { useAppContext } from './context/AppContext';
import AppRouter from './router';
import useWebSocket from './hooks/useWebSocket';

const AppContent = () => {
  const { darkMode } = useAppContext();
  const { isSocketConnected, sendSocketMessage } = useWebSocket('ws://127.0.0.1:8000/ws');

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Router>
        <Header isSocketConnected= {isSocketConnected}/>
          <AppRouter sendSocketMessage = {sendSocketMessage}/>
      </Router>
    </div>
  );
};

const App = () => {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
};

export default App;