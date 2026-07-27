'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, Eye, EyeOff, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [emailInput, setEmailInput] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user already passed Step 1 email verification in this session
    if (document.cookie.includes('admin-allowed-session=true')) {
      setStep(2);
    }
  }, []);

  // Allowed authorized emails/keys
  const getAuthorizedEmails = () => {
    let allowed = ['powerhouse', 'powerhousefitnessclub2026@gmail.com', 'akalyakrish14@gmail.com'];
    if (process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS) {
      allowed = [
        ...allowed,
        ...process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS.split(',').map((item) => item.trim().toLowerCase())
      ];
    }
    return allowed;
  };

  const handleEmailVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const input = emailInput.trim().toLowerCase();
    const allowedList = getAuthorizedEmails();

    if (!input) {
      setError('Please enter your authorized email address.');
      return;
    }

    if (allowedList.includes(input)) {
      // Authorized email verified! Set allowed session cookie (valid 10 mins)
      document.cookie = "admin-allowed-session=true; path=/; max-age=600; SameSite=Strict";
      setStep(2);
      setError('');
    } else {
      setError('Access denied: Unauthorized email address. Only authorized administrator emails are permitted.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.replace('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Step Progress Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 text-xs text-neutral-400 font-semibold uppercase tracking-wider">
          <span className={step === 1 ? 'text-amber-500 font-bold flex items-center gap-1.5' : 'text-emerald-400 flex items-center gap-1.5'}>
            {step === 2 ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : null}
            1. Email Verification
          </span>
          <ArrowRight className="w-4 h-4 text-neutral-600" />
          <span className={step === 2 ? 'text-amber-500 font-bold' : 'text-neutral-600'}>
            2. Password Authentication
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-amber-500 mb-2">
            {step === 1 ? 'Admin Verification' : 'Admin Login'}
          </h1>
          <p className="text-neutral-400 text-sm">
            {step === 1 
              ? 'Enter authorized administrator email to proceed' 
              : 'Sign in to access Power House Gym Dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          /* STEP 1: EMAIL VERIFICATION FORM */
          <form onSubmit={handleEmailVerification} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Authorized Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#121212] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                  placeholder="Enter authorized email address"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-2 shadow-lg shadow-amber-500/10"
            >
              Verify Email & Proceed <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: USERNAME & PASSWORD LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Username / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#121212] border border-white/10 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#121212] border border-white/10 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  document.cookie = "admin-allowed-session=; path=/; max-age=0";
                  setStep(1);
                  setError('');
                }}
                className="px-4 py-3.5 rounded-xl border border-white/10 text-neutral-400 hover:text-white text-xs uppercase font-bold tracking-wider transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-2 shadow-lg shadow-amber-500/10"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
