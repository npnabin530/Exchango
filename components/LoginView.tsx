import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Chrome, Apple } from 'lucide-react';
import { Logo } from './Logo';
import { User } from '../types';
import { auth, googleProvider } from '../services/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

interface LoginViewProps {
  onNavigate: (view: any) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onLogin: (user: Partial<User>) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate, onNotify, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      onNotify("Please fill in all fields", "error");
      return;
    }

    setIsLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, password);
        onNotify("Welcome back, Boss. Access granted.", "success");
        // App.tsx auth listener will handle redirection
    } catch (error: any) {
         let msg = "Invalid credentials";
         if (error.code === 'auth/user-not-found') msg = "User not found";
         if (error.code === 'auth/wrong-password') msg = "Incorrect password";
         if (error.code === 'auth/invalid-email') msg = "Invalid email format";
         onNotify(msg, "error");
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
      try {
          await signInWithPopup(auth, googleProvider);
          onNotify("Welcome back, Boss.", "success");
      } catch (error: any) {
          onNotify("Google sign in failed", "error");
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-exchango-accent/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-exchango-purple/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <button 
          onClick={() => onNavigate('home')}
          className="absolute -top-12 left-0 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Market
        </button>

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo className="w-16 h-16" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-400">Sign in to access your portfolio</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 group-focus-within:text-exchango-accent transition-colors">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-[#0B0E14] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-exchango-accent focus:ring-1 focus:ring-exchango-accent transition-all sm:text-sm"
                    placeholder="boss@starkindustries.com"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 group-focus-within:text-exchango-accent transition-colors">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-[#0B0E14] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-exchango-accent focus:ring-1 focus:ring-exchango-accent transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded bg-[#0B0E14] border-gray-600 text-exchango-accent focus:ring-exchango-accent/50 focus:ring-offset-0"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" onClick={(e) => {e.preventDefault(); onNotify("Reset link sent via neural net.", "info")}} className="font-medium text-exchango-accent hover:text-cyan-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-gradient-to-r from-exchango-accent to-blue-500 hover:from-cyan-300 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-exchango-accent shadow-[0_0_20px_rgba(0,209,255,0.3)] transition-all ${isLoading ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02]'}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#13161C] text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all">
                <Chrome size={18} /> <span className="text-sm font-medium text-white">Google</span>
              </button>
              <button type="button" onClick={() => onNotify("Feature restricted by Apple Protocol.", "info")} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all">
                <Apple size={18} /> <span className="text-sm font-medium text-white">Apple</span>
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <button onClick={() => onNavigate('signup')} className="font-bold text-white hover:text-exchango-accent transition-colors">
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};