import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const LOGO_BG = '#111828';
const TITLE_TEXT_CLASS = 'text-sm';
const BODY_TEXT_CLASS = 'text-[11px]';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isStrongPassword = (value: string) => /^(?=.*[A-Za-z])(?=.*\d).{5,}$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (mode === 'signup' && !isStrongPassword(password)) {
      setError('Password must be at least 5 characters and include letters and numbers.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (signUpError) {
          const msg = signUpError.message.toLowerCase();
          if (msg.includes('already') || msg.includes('registered')) {
            setError('This email is already used.');
          } else {
            setError(signUpError.message);
          }
        } else if (signUpData?.user && (signUpData.user.identities?.length ?? 0) === 0) {
          setError('This email is already used.');
        } else {
          setMessage('Account created. A confirmation link was sent to your email.');
          setMode('signin');
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex h-screen items-center justify-center overflow-hidden p-4"
      style={{
        backgroundColor: LOGO_BG,
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(249,115,22,0.18), transparent 38%), radial-gradient(circle at 80% 15%, rgba(255,255,255,0.09), transparent 34%), linear-gradient(145deg, #111828 0%, #0e1530 55%, #101b3a 100%)',
      }}
    >
      <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl" />
      <div className="absolute right-0 top-1/3 h-40 w-40 rounded-full bg-blue-300/10 blur-2xl" />
      <div className="absolute bottom-10 left-1/3 h-36 w-36 rounded-full bg-orange-300/10 blur-2xl" />

      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white/95 p-4 shadow-sm">
        <div className="mb-4 text-center">
          <div className="mx-auto w-fit rounded-lg p-1" style={{ backgroundColor: LOGO_BG }}>
            <img src="/logo.png" alt="Ground Control Logo" className="h-20 w-20 object-contain" />
          </div>
          <h1 className={`mt-2 font-bold text-gcs-text-dark ${TITLE_TEXT_CLASS}`}>Ground Control Station Mobile</h1>
          <p className={`mt-0.5 text-gray-600 ${BODY_TEXT_CLASS}`}>for Smart Mosquito Control Drone</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700/60">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`rounded-md px-2 py-1.5 font-semibold ${BODY_TEXT_CLASS} ${mode === 'signin' ? 'bg-white text-gcs-text-dark' : 'text-gray-600'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-md px-2 py-1.5 font-semibold ${BODY_TEXT_CLASS} ${mode === 'signup' ? 'bg-white text-gcs-text-dark' : 'text-gray-600'}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 ${BODY_TEXT_CLASS}`}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 ${BODY_TEXT_CLASS}`}
          />
          {mode === 'signup' && (
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 ${BODY_TEXT_CLASS}`}
            />
          )}

          {error && <p className={`text-center font-medium text-red-500 ${BODY_TEXT_CLASS}`}>{error}</p>}
          {message && <p className={`text-center font-medium text-green-600 ${BODY_TEXT_CLASS}`}>{message}</p>}
          <p className={`text-center text-gray-500 ${BODY_TEXT_CLASS}`}>
            Sign in to continue.
            <br />
            Create an account if you are new.
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg bg-gcs-primary px-3 py-2 font-bold text-white disabled:opacity-60 ${BODY_TEXT_CLASS}`}
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
