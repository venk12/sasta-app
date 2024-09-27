import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import DashboardInterface from './components/DashboardInterface';
import BaselineInterface from './components/BaselineInterface';

const AppRouter = ({sendSocketMessage}) => {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />}/>
      <Route path="/dashboard" element={<DashboardInterface />} />
      <Route path="/chat" element={<ChatInterface sendSocketMessage={sendSocketMessage}/>} />
      <Route path="/baseline" element={<BaselineInterface />} />
    </Routes>
  );
};

export default AppRouter;