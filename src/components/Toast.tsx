// src/components/Toast.tsx
import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastContainer: React.FC = () => {
  return (
    <Toaster
      position="top-right" 
      reverseOrder={false}
      gutter={8}
    />
  );
};
