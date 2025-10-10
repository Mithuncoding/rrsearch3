import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Modal({ isOpen, onClose, children, title, size = 'md', className = '' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative glass-card w-full ${sizes[size]} max-h-[90vh] overflow-y-auto scrollbar-custom ${className} fade-in-up`}>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold gradient-text">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
