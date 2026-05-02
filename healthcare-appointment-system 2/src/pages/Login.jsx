import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

// Demo accounts for testing
const DEMO_USERS = [
  { id: 1, email: 'patient@demo.com', password: 'demo123', name: 'Rahul Sharma', phone: '9876543210', age: 28, gender: 'Male', role: 'patient' },
  { id: 2, email: 'admin@demo.com',   password: 'admin123', name: 'Admin User', phone: '9876543211', role: 'admin' },
];

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector(s => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validate()) return;
    dispatch(loginStart());
    await new Promise(r => setTimeout(r, 800));
    const user = DEMO_USERS.find(u => u.email === form.email && u.password === form.password);
    if (user) {
      const { password: _, ...safeUser } = user;
      dispatch(loginSuccess(safeUser));
      toast.success(`Welcome back, ${safeUser.name.split(' ')[0]}! 👋`);
      navigate(from, { replace: true });
    } else {
      dispatch(loginFailure('Invalid email or password.'));
    }
  };

  const fillDemo = () => {
    setForm({ email: 'patient@demo.com', password: 'demo123' });
    setErrors({});
    dispatch(clearError());
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
            🏥
          </div>
          <h1 className="font-display text-3xl text-slate-800 dark:text-white">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Sign in to your MedBook account</p>
        </div>

        <div className="card p-8">
          {/* Demo Account Banner */}
          <div className="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-xl p-4 mb-6">
            <p className="text-sm text-primary-700 dark:text-primary-300 font-medium mb-2">🎓 Demo Account</p>
            <p className="text-xs text-primary-600 dark:text-primary-400">Email: patient@demo.com · Password: demo123</p>
            <button onClick={fillDemo} className="mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 underline hover:no-underline">
              Auto-fill credentials →
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-3 mb-5 text-sm text-red-600 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter password"
                  className="input-field pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xl"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
