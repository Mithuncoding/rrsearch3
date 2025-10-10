export function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-lg',
    card: 'h-48 w-full rounded-xl',
  };

  return <div className={`skeleton ${variants[variant]} ${className}`} />;
}

export function SkeletonGroup({ count = 3, variant = 'text', className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
