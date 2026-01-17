import React from 'react';
import toast from 'react-hot-toast';

const Toast = {
  success: (message) => toast.success(message, {
    style: {
      background: '#1f2937',
      color: '#f9fafb',
      border: '1px solid #374151'
    },
    iconTheme: {
      primary: '#8b5cf6',
      secondary: '#f9fafb'
    }
  }),
  error: (message) => toast.error(message, {
    style: {
      background: '#1f2937',
      color: '#f9fafb',
      border: '1px solid #374151'
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#f9fafb'
    }
  }),
  info: (message) => toast(message, {
    style: {
      background: '#1f2937',
      color: '#f9fafb',
      border: '1px solid #374151'
    },
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#f9fafb'
    }
  })
};

export default Toast;