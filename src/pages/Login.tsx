import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginThunk, setError } from '@/store/authSlice';
import { Activity, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<{ email?: string; password?: string }>({});
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    setFieldError({});
    dispatch(setError(null));

    if (!email) { setFieldError({ email: 'Please enter your email' }); return; }
    if (!password) { setFieldError({ password: 'Please enter your password' }); return; }

    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
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
          <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-300 text-sm">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-slate-300 text-sm mb-1">Email</label>
            <input
              ref={emailRef}
              type="email"
              defaultValue=""
              placeholder="maria.reyes@trial.com"
              className={`w-full px-3 py-2 bg-navy-900 border rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 ${fieldError.email ? 'border-red-500' : 'border-slate-600'}`}
            />
            {fieldError.email && <p className="mt-1 text-xs text-red-400">{fieldError.email}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-slate-300 text-sm mb-1">Password</label>
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                defaultValue=""
                placeholder="Enter password"
                className={`w-full px-3 py-2 bg-navy-900 border rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 pr-10 ${fieldError.password ? 'border-red-500' : 'border-slate-600'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldError.password && <p className="mt-1 text-xs text-red-400">{fieldError.password}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white font-medium rounded transition-colors">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="mt-4 text-center text-slate-400 text-sm">
            Don't have an account?{' '}<Link to="/register" className="text-cyan-400 hover:text-cyan-300">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
