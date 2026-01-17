import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MainLayout from './layouts/MainLayout';
import usePageTracking from './hooks/usePageTracking';

function App() {
  usePageTracking();
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/adminlogin" element={<AdminLoginPage />} />
        <Route path="/admindashboard" element={<AdminDashboardPage />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
