import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <Loader2 className={`${sizes[size]} animate-spin text-prism-600 ${className}`} />
  );
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center touch-none" style={{ WebkitBackdropFilter: 'blur(4px)' }}>
      <motion.div 
        className="glass-card p-6 md:p-8 flex flex-col items-center gap-4 md:gap-6 mx-4 max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Enhanced Spinner */}
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-r from-prism-600 via-accent-purple to-accent-pink opacity-75 blur-md"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-prism-600 via-accent-purple to-accent-pink"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-2 rounded-full bg-white" />
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-r from-prism-600/20 to-accent-purple/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Message with animated dots */}
        <div className="flex items-center gap-2">
          <p className="text-base md:text-lg font-medium text-slate-700 text-center">{message}</p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-prism-600"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-prism-600 via-accent-purple to-accent-pink"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
