import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../../core/auth/AuthContext';

export function PinAuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (pin.length < 4) {
        throw new Error('PIN must be at least 4 digits');
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/auth" className="text-[#800000]/60 hover:text-[#800000]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-bold text-[#800000] ml-4">Manager PIN Login</h2>
      </div>
      
      {error && (
        <div className="mb-4 bg-[#fee8eb] border border-[#ebd5da] text-[#800000] px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handlePinLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#800000] mb-1">Enter your 4-digit PIN</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-[#800000]/60" />
            </div>
            <input
              type="password"
              required
              maxLength={4}
              pattern="[0-9]*"
              inputMode="numeric"
              className="block w-full pl-10 pr-3 py-3 border border-[#ebd5da] rounded-lg bg-[#fdf5f6] text-[#800000] placeholder-[#800000]/40 focus:outline-none focus:ring-2 focus:ring-[#800000] sm:text-2xl text-center tracking-[1em] font-black"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#800000] hover:bg-[#680016] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Unlock Terminal'}
        </button>
      </form>
    </div>
  );
}
