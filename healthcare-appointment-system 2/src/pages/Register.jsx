import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', age: '', gender: '', password: '', confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Enter full name (min 2 chars)';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit Indian phone number required';
    if (!form.age || form.age < 1 || form.age > 120) e.age = 'Valid age required';
    if (!form.gender) e.gender = 'Please select gender';
    if (!form.password || form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginStart());
    await new Promise(r => setTimeout(r, 900));
    const user = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email,
      phone: form.phone,
      age: form.age,
      gender: form.gender,
      role: 'patient',
    };
    dispatch(loginSuccess(user));
    toast.success(`Account created! Welcome, ${user.name.split(' ')[0]}! 🎉`);
    navigate('/doctors');
  };

  const setField = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-lg animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-primary-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
            ✨
          </div>
          <h1 className="font-display text-3xl text-slate-800 dark:text-white">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Join MedBook to manage your health appointments</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Full Name *</label>
              <input type="text" value={form.name} onChange={setField('name')} placeholder="Rahul Sharma" className="input-field" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Email Address *</label>
              <input type="email" value={form.email} onChange={setField('email')} placeholder="you@example.com" className="input-field" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Phone *</label>
                <input type="tel" value={form.phone} onChange={setField('phone')} placeholder="9876543210" maxLength={10} className="input-field" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Age *</label>
                <input type="number" value={form.age} onChange={setField('age')} placeholder="25" min={1} max={120} className="input-field" />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Gender *</label>
              <div className="flex gap-3">
                {['Male', 'Female', 'Other'].map(g => (
                  <button type="button" key={g} onClick={() => setForm(f => ({ ...f, gender: g }))}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      form.gender === g
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary-300'
                    }`}
                  >{g}</button>
                ))}
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Password *</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={setField('password')} placeholder="Min. 6 characters" className="input-field pr-12" />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xl">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Confirm Password *</label>
              <input type="password" value={form.confirm} onChange={setField('confirm')} placeholder="Re-enter password" className="input-field" />
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
