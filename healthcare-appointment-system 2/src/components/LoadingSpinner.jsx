export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className={`${sizes[size]} rounded-full border-primary-200 border-t-primary-500 animate-spin`}
      />
      {text && <p className="text-slate-500 dark:text-slate-400 text-sm">{text}</p>}
    </div>
  );
}
