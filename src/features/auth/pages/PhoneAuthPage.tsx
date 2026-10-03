import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Smartphone, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { ConfirmationResult } from 'firebase/auth';

export function PhoneAuthPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    const setupRecaptcha = async () => {
      try {
        window.recaptchaVerifier = await authService.setupRecaptcha('recaptcha-container');
      } catch (err) {
        console.error("Recaptcha error:", err);
      }
    };
    setupRecaptcha();
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!window.recaptchaVerifier) {
        throw new Error('Recaptcha not initialized');
      }
      
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : '+' + phoneNumber;
      const result = await authService.sendPhoneOTP(formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!confirmationResult) throw new Error('No confirmation result');
      await confirmationResult.confirm(otp);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid code');
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
        <h2 className="text-2xl font-bold text-[#800000] ml-4">Phone Sign-in</h2>
      </div>
      
      {error && (
        <div className="mb-4 bg-[#fee8eb] border border-[#ebd5da] text-[#800000] px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {!confirmationResult ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#800000] mb-1">Phone Number (with Country Code)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="h-5 w-5 text-[#800000]/60" />
              </div>
              <input
                type="tel"
                required
                className="block w-full pl-10 pr-3 py-2 border border-[#ebd5da] rounded-lg bg-[#fdf5f6] text-[#800000] placeholder-[#800000]/40 focus:outline-none focus:ring-2 focus:ring-[#800000] sm:text-sm font-medium"
                placeholder="+919876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          
          <div id="recaptcha-container"></div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#800000] hover:bg-[#680016] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <p className="text-sm text-[#800000]/80 mb-4 font-medium">
            We sent a verification code to {phoneNumber}.
          </p>
          
          <div>
            <label className="block text-sm font-bold text-[#800000] mb-1">Verification Code</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShieldCheck className="h-5 w-5 text-[#800000]/60" />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-2 border border-[#ebd5da] rounded-lg bg-[#fdf5f6] text-[#800000] placeholder-[#800000]/40 focus:outline-none focus:ring-2 focus:ring-[#800000] sm:text-sm tracking-widest font-bold text-center"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#800000] hover:bg-[#680016] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Sign In'}
          </button>
        </form>
      )}
    </div>
  );
}
