import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Mail, Lock, Loader2, Smartphone, KeyRound } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.loginWithEmail(email, password);
      // AuthContext will handle navigation when auth state changes
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.loginWithGoogle();
      // AuthContext will handle navigation when auth state changes
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.loginWithApple();
      // AuthContext will handle navigation when auth state changes
    } catch (err: any) {
      setError(err.message || 'Failed to login with Apple');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#800000] mb-6 text-center">Sign in to your account</h2>
      
      {error && (
        <div className="mb-4 bg-[#fee8eb] border border-[#ebd5da] text-[#800000] px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#800000] mb-1">Email address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-[#800000]/60" />
            </div>
            <input
              type="email"
              required
              className="block w-full pl-10 pr-3 py-2 border border-[#ebd5da] rounded-lg bg-[#fdf5f6] text-[#800000] placeholder-[#800000]/40 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent sm:text-sm font-medium"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#800000] mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#800000]/60" />
            </div>
            <input
              type="password"
              required
              className="block w-full pl-10 pr-3 py-2 border border-[#ebd5da] rounded-lg bg-[#fdf5f6] text-[#800000] placeholder-[#800000]/40 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent sm:text-sm font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-[#ebd5da] rounded accent-[#800000]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm font-semibold text-[#800000]">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/auth/forgot-password" className="font-bold text-[#800000] hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#800000] hover:bg-[#680016] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#ebd5da]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="px-2 bg-white text-[#800000]/70 font-bold">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-[#ebd5da] rounded-lg shadow-xs bg-white text-sm font-bold text-[#800000] hover:bg-[#fdf5f6] transition-colors"
          >
            Google
          </button>

          <button
            onClick={handleAppleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-[#ebd5da] rounded-lg shadow-xs bg-white text-sm font-bold text-[#800000] hover:bg-[#fdf5f6] transition-colors"
          >
            Apple
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          to="/auth/phone"
          className="w-full flex items-center justify-center px-4 py-2 border border-[#ebd5da] rounded-lg shadow-xs bg-[#fdf5f6] text-sm font-bold text-[#800000] hover:bg-[#fee8eb] transition-colors"
        >
          <Smartphone className="h-4 w-4 mr-2 text-[#800000]" />
          Phone
        </Link>
        <Link
          to="/auth/pin"
          className="w-full flex items-center justify-center px-4 py-2 border border-[#ebd5da] rounded-lg shadow-xs bg-[#fdf5f6] text-sm font-bold text-[#800000] hover:bg-[#fee8eb] transition-colors"
        >
          <KeyRound className="h-4 w-4 mr-2 text-[#800000]" />
          PIN / Biometric
        </Link>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-[#800000]/70 font-medium">Don't have an account? </span>
        <Link to="/auth/register" className="font-bold text-[#800000] underline hover:text-[#680016]">
          Sign up
        </Link>
      </div>
    </div>
  );
}
