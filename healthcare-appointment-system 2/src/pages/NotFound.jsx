import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="text-8xl mb-6">🏥</div>
        <h1 className="font-display text-6xl text-primary-500 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-3">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
          Looks like this page went for a check-up and never came back. Let's get you back on track.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">← Go Home</Link>
          <Link to="/doctors" className="btn-secondary">Find Doctors</Link>
        </div>
      </div>
    </div>
  );
}
