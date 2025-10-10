import { motion } from 'framer-motion';

export function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`relative ${sizes[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-prism-600 via-accent-purple to-accent-pink opacity-75 blur-sm"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-prism-600 via-accent-purple to-accent-pink"></div>
        <div className="absolute inset-2 rounded-full bg-white"></div>
      </motion.div>
      {message && (
        <motion.p
          className="text-sm text-slate-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

export function PulseLoader() {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full bg-gradient-to-r from-prism-600 to-accent-purple"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
}

export function ProgressBar({ progress = 0, message = '' }) {
  return (
    <div className="w-full max-w-md space-y-2">
      <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-prism-600 via-accent-purple to-accent-pink rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
        </motion.div>
      </div>
      {message && (
        <p className="text-sm text-slate-600 text-center">{message}</p>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-200 rounded"
          style={{ width: `${100 - (i * 10)}%` }}
        ></div>
      ))}
    </div>
  );
}

export function SmartLoader({ type = 'spinner', ...props }) {
  switch (type) {
    case 'pulse':
      return <PulseLoader {...props} />;
    case 'progress':
      return <ProgressBar {...props} />;
    case 'skeleton':
      return <SkeletonCard {...props} />;
    case 'text':
      return <SkeletonText {...props} />;
    default:
      return <LoadingSpinner {...props} />;
  }
}
