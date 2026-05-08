import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const LOGO_BG = '#080a12';
const TITLE_TEXT_CLASS = 'text-sm';
const BODY_TEXT_CLASS = 'text-[11px]';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [barangay, setBarangay] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isStrongPassword = (value: string) => /^(?=.*[A-Za-z])(?=.*\d).{5,}$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password || !barangay) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && !fullName) {
      setError('Full name is required.');
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
            data: {
              full_name: fullName,
              role: 'LGU Personnel',
              barangay_id: parseInt(barangay, 10),
            },
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
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else if (signInData?.user) {
          // Log at the database which barangay users selected during sign-in
          await supabase.auth.updateUser({
            data: { barangay_id: parseInt(barangay, 10) },
          });
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
          'linear-gradient(180deg, rgba(255,69,79,0.08), transparent 24%), linear-gradient(145deg, #080a12 0%, #111421 55%, #181c2c 100%)',
      }}
    >
      <div className="relative z-10 w-full max-w-sm rounded-md border border-white/10 bg-[#191d2d]/95 p-4 shadow-[0_0_28px_rgba(255,69,79,0.18)]">
        <div className="mb-4 text-center">
          <div className="mx-auto w-fit rounded border border-gcs-primary/40 p-1 shadow-[0_0_22px_rgba(255,69,79,0.35)]" style={{ backgroundColor: LOGO_BG }}>
            <img src="/logo.png" alt="Ground Control Logo" className="h-20 w-20 object-contain" />
          </div>
          <h1 className={`mt-3 font-mono font-black uppercase italic tracking-[0.08em] text-gcs-text-dark ${TITLE_TEXT_CLASS}`}>
            LIPAD<br />GCS MOBILE
          </h1>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1 rounded border border-white/10 bg-[#0e111b] p-1 dark:bg-gray-700/60">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`rounded px-2 py-1.5 font-mono font-semibold uppercase tracking-[0.12em] ${BODY_TEXT_CLASS} ${mode === 'signin' ? 'bg-gcs-primary/15 text-gcs-primary' : 'text-gray-500'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded px-2 py-1.5 font-mono font-semibold uppercase tracking-[0.12em] ${BODY_TEXT_CLASS} ${mode === 'signup' ? 'bg-gcs-primary/15 text-gcs-primary' : 'text-gray-500'}`}
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
            className={`w-full rounded border border-white/10 bg-[#0e111b] px-3 py-2 font-mono text-white ${BODY_TEXT_CLASS}`}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className={`w-full rounded border border-white/10 bg-[#0e111b] px-3 py-2 font-mono text-white ${BODY_TEXT_CLASS}`}
          />
          {mode === 'signup' && (
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className={`w-full rounded border border-white/10 bg-[#0e111b] px-3 py-2 font-mono text-white ${BODY_TEXT_CLASS}`}
            />
          )}

          {mode === 'signup' && (
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Full Name"
              className={`w-full rounded border border-white/10 bg-[#0e111b] px-3 py-2 font-mono text-white ${BODY_TEXT_CLASS}`}
            />
          )}

          <select
            value={barangay}
            onChange={e => setBarangay(e.target.value)}
            className={`w-full rounded border border-white/10 bg-[#0e111b] px-3 py-2 font-mono text-white outline-none focus:border-gcs-primary ${BODY_TEXT_CLASS}`}
          >
            <option value="" disabled>Select Barangay</option>
            <option value="1">Barangay 426</option>
            <option value="2">Barangay 421</option>
            <option value="3">Barangay 428</option>
          </select>

          {error && <p className={`text-center font-medium text-red-500 ${BODY_TEXT_CLASS}`}>{error}</p>}
          {message && <p className={`text-center font-medium text-green-600 ${BODY_TEXT_CLASS}`}>{message}</p>}
          <p className={`text-center font-mono uppercase tracking-[0.12em] text-gray-500 ${BODY_TEXT_CLASS}`}>
            Sign in to continue.
            <br />
            Create an account if you are new.
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded bg-gcs-primary px-3 py-2 font-mono font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_22px_rgba(255,69,79,0.4)] disabled:opacity-60 ${BODY_TEXT_CLASS}`}
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
