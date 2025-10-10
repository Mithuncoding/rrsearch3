export function Card({ children, className = '', glass = false }) {
  return (
    <div className={`${glass ? 'glass-card' : 'bg-white border border-slate-200'} rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}
