
import React, { useState } from 'react';
import Footer from './Footer';
import { supabase } from '../services/supabaseClient';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMsg("Supabase not configured. Check API keys.");
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    
    // Attempt sign in (if user exists) or sign up (if new)
    // For simplicity in this demo, we'll try sign in first
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // If login fails, try signing up
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setErrorMsg(signUpError.message);
      } else {
        alert("Check your email for the confirmation link!");
      }
    }
    
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      setErrorMsg("Supabase not configured.");
      return;
    }
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin // Redirect back to this app
      }
    });
    if (error) setErrorMsg(error.message);
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative w-full">
      <div className="flex-grow flex flex-col w-full p-4">
        
        <div className="glass w-full max-w-md p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl z-10 m-auto my-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="text-center mb-8 md:mb-10 relative z-10">
            <div className="text-5xl md:text-6xl mb-4 animate-bounce">🔐</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tighter rizz-gradient bg-clip-text text-transparent">
              RIZZ MASTER
            </h1>
            <p className="text-white/60 font-medium text-sm md:text-base">Unlock your dating potential.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 relative z-10">
            {errorMsg && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 md:p-4 text-white focus:ring-2 focus:ring-pink-500/50 focus:outline-none transition-all placeholder:text-white/20 text-base"
                placeholder="smooth_operator@example.com"
                style={{ fontSize: '16px' }} 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 md:p-4 text-white focus:ring-2 focus:ring-pink-500/50 focus:outline-none transition-all placeholder:text-white/20 text-base"
                placeholder="••••••••"
                style={{ fontSize: '16px' }} 
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full rizz-gradient py-3.5 md:py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 md:mt-6"
            >
              {isLoading ? "Loading..." : "Enter Rizz Master"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6 relative z-10">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-white/30 uppercase tracking-widest">Or</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-white text-gray-900 py-3.5 md:py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-50 relative z-10 flex items-center justify-center gap-3"
          >
            {isGoogleLoading ? "Connecting..." : (
              <>
                <GoogleIcon />
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>
        
        <Footer className="mt-8 z-10 shrink-0" />
      </div>
    </div>
  );
};

export default LoginPage;
