import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

let toastId = 0;
const listeners = new Set();

export const toast = {
  success: (message) => notify({ type: 'success', message }),
  error: (message) => notify({ type: 'error', message }),
  info: (message) => notify({ type: 'info', message }),
};

function notify(toast) {
  const id = toastId++;
  const newToast = { id, ...toast };
  listeners.forEach(listener => listener(prev => [...prev, newToast]));
  setTimeout(() => {
    listeners.forEach(listener => listener(prev => prev.filter(t => t.id !== id)));
  }, 5000);
}

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    listeners.add(setToasts);
    return () => listeners.delete(setToasts);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
      ))}
    </div>
  );
}

function Toast({ type, message, onClose }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${bgColors[type]} backdrop-blur-xl shadow-lg min-w-[300px] fade-in-up`}>
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-slate-700">{message}</p>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
