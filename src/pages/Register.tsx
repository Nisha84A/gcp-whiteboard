import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { registerThunk, setError } from '@/store/authSlice';
import { Activity } from 'lucide-react';

export default function Register() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value || '';
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const confirm = confirmRef.current?.value || '';

    setFieldErrors({});
    dispatch(setError(null));

    const errors: Record<string, string> = {};
    if (!name) errors.name = 'Please enter your name';
    if (!email) errors.email = 'Please enter your email';
    if (!password) errors.password = 'Please enter a password';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (!confirm) errors.confirm = 'Please confirm your password';
    else if (password && password !== confirm) errors.confirm = 'Passwords do not match';

    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    const result = await dispatch(registerThunk({ email, password, name }));
    if (registerThunk.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-cyan-400">TrialClarity</h1>
          </div>
          <p className="text-slate-400 text-sm">Clinical Trial Data Review Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-navy-800 rounded-lg p-8 shadow-xl border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">Create Account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-300 text-sm">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-slate-300 text-sm mb-1">Full Name</label>
            <input ref={nameRef} type="text" defaultValue="" placeholder="Dr. Jane Smith" className={`w-full px-3 py-2 bg-navy-900 border rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 ${fieldErrors.name ? 'border-red-500' : 'border-slate-600'}`} />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-slate-300 text-sm mb-1">Email</label>
            <input ref={emailRef} type="email" defaultValue="" placeholder="you@trial.com" className={`w-full px-3 py-2 bg-navy-900 border rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 ${fieldErrors.email ? 'border-red-500' : 'border-slate-600'}`} />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-slate-300 text-sm mb-1">Password</label>
            <input ref={passwordRef} type="password" defaultValue="" placeholder="Min. 8 characters" className={`w-full px-3 py-2 bg-navy-900 border rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 ${fieldErrors.password ? 'border-red-500' : 'border-slate-600'}`} />
            {fieldErrors.password && <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-slate-300 text-sm mb-1">Confirm Password</label>
            <input ref={confirmRef} type="password" defaultValue="" placeholder="Re-enter password" className={`w-full px-3 py-2 bg-navy-900 border rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 ${fieldErrors.confirm ? 'border-red-500' : 'border-slate-600'}`} />
            {fieldErrors.confirm && <p className="mt-1 text-xs text-red-400">{fieldErrors.confirm}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white font-medium rounded transition-colors">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="mt-4 text-center text-slate-400 text-sm">
            Already have an account?{' '}<Link to="/login" className="text-cyan-400 hover:text-cyan-300">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
