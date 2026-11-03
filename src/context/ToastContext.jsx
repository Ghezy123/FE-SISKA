import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        fontFamily: 'Inter, sans-serif',
      }}>
        {toasts.map((t) => {
          let bg = '#1e293b';
          let border = '#334155';
          let icon = 'ℹ️';

          if (t.type === 'success') {
            bg = '#15803d';
            border = '#166534';
            icon = '✓';
          } else if (t.type === 'error') {
            bg = '#dc2626';
            border = '#991b1b';
            icon = '✕';
          } else if (t.type === 'warning') {
            bg = '#d97706';
            border = '#b45309';
            icon = '⚠';
          }

          return (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                background: bg,
                border: `1px solid ${border}`,
                color: '#ffffff',
                padding: '12px 18px',
                borderRadius: '10px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: '260px',
                maxWidth: '400px',
                animation: 'slideInRight 0.25s ease-out',
              }}
            >
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <span style={{ flex: 1 }}>{t.message}</span>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  opacity: 0.75,
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: 0,
                  marginLeft: '8px',
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast harus digunakan di dalam ToastProvider');
  }
  return context;
};

