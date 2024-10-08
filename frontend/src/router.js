import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import DashboardInterface from './components/DashboardInterface';
import BaselineInterface from './components/BaselineInterface';
import SearchInterface from './components/SearchInterface.js';

const AppRouter = ({sendSocketMessage}) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />}/>
      <Route path="/dashboard" element={<DashboardInterface />} />
      <Route path="/chat" element={<ChatInterface sendSocketMessage={sendSocketMessage}/>} />
      <Route path="/baseline" element={<BaselineInterface />} />
      <Route path="/search" element={<SearchInterface />} /> 
    </Routes>
  );
};

export default AppRouter;