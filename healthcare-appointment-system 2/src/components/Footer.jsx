import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white text-base">
                ❤️
              </div>
              <span className="font-display text-lg text-primary-600 dark:text-primary-400">MedBook</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Your trusted healthcare appointment management platform, connecting patients with top specialists.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-3 text-sm uppercase tracking-wide">Quick Links</h4>
            <div className="space-y-2">
              {[['/', 'Home'], ['/doctors', 'Find Doctors'], ['/dashboard', 'My Appointments'], ['/login', 'Sign In']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-3 text-sm uppercase tracking-wide">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {['React 18', 'Vite', 'Redux Toolkit', 'React Router', 'Tailwind CSS', 'Recharts'].map(t => (
                <span key={t} className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 text-xs">© 2024 MedBook Healthcare. Capstone Project — React + Redux Toolkit.</p>
          <p className="text-slate-400 text-xs">Built with ❤️ using Vite + React + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
