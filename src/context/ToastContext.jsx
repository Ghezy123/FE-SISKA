import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 2500) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    setToasts((prev) => {
      // Maksimal 3 notif: jika muncul notif ke-4, notif pertama otomatis dibuang agar tidak menumpuk
      const trimmed = prev.length >= 3 ? prev.slice(prev.length - 2) : prev;
      return [...trimmed, { id, message, type }];
    });

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
      {/* Toast Keyframes Animation */}
      <style>{`
        @keyframes toastSlideInSmooth {
          0% {
            opacity: 0;
            transform: translateX(35px) scale(0.94);
          }
          60% {
            opacity: 1;
            transform: translateX(-4px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .siska-toast-item {
          animation: toastSlideInSmooth 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: all 0.25s ease;
        }
      `}</style>
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
              className="siska-toast-item"
              style={{
                pointerEvents: 'auto',
                background: bg,
                border: `1px solid ${border}`,
                color: '#ffffff',
                padding: '12px 18px',
                borderRadius: '12px',
                boxShadow: '0 12px 30px -6px rgba(0,0,0,0.25), 0 4px 10px -2px rgba(0,0,0,0.15)',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: '260px',
                maxWidth: '380px',
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

