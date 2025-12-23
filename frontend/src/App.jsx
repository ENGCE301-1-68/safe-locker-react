import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const isAdmin = localStorage.getItem('admin'); // simple session

  return (
    <Routes>
      <Route path="/" element={isAdmin ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard/*" element={isAdmin ? <Dashboard /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
