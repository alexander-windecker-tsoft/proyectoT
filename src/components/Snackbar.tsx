import React, { useEffect } from 'react';
import './Snackbar.css';

interface SnackbarProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info' | 'warning';
}

const Snackbar: React.FC<SnackbarProps> = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 3000,
  type = 'success'
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`snackbar ${type} ${isVisible ? 'show' : ''}`}>
      <div className="snackbar-content">
        <span className="snackbar-icon">
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'info' && 'ℹ️'}
          {type === 'warning' && '⚠️'}
        </span>
        <span className="snackbar-message">{message}</span>
        <button className="snackbar-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default Snackbar;
