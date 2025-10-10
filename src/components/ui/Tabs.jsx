export function Tabs({ value, onValueChange, children, className = '' }) {
  return (
    <div className={`tabs ${className}`}>
      {children.map(child => {
        if (child.type === TabsList) {
          return { ...child, props: { ...child.props, value, onValueChange } };
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, value, onValueChange, className = '' }) {
  return (
    <div className={`flex gap-2 border-b-2 border-slate-200 pb-2 ${className}`}>
      {children.map(child => 
        child.type === TabsTrigger 
          ? { ...child, props: { ...child.props, active: child.props.value === value, onClick: () => onValueChange(child.props.value) } }
          : child
      )}
    </div>
  );
}

export function TabsTrigger({ value, active, onClick, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`${active ? 'tab-button-active' : 'tab-button'} ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeValue, children, className = '' }) {
  if (value !== activeValue) return null;
  
  return (
    <div className={`mt-6 fade-in-up ${className}`}>
      {children}
    </div>
  );
}
