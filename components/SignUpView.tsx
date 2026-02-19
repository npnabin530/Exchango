import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { User as UserType } from '../types';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface SignUpViewProps {
  onNavigate: (view: any) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onLogin: (user: Partial<UserType>) => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({ onNavigate, onNotify, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      onNotify("Please fill in all required fields", "error");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      onNotify("Passwords do not match", "error");
      return;
    }
    if (!formData.agreed) {
        onNotify("Please agree to the Terms of Service", "error");
        return;
    }

    setIsLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        // Update Display Name
        await updateProfile(user, {
            displayName: formData.name
        });

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: formData.name,
            email: formData.email,
            memberSince: new Date().toISOString(),
            createdAt: new Date()
        });

        onNotify("Account created successfully. Welcome aboard.", "success");
    } catch (error: any) {
        let msg = "Failed to create account";
        if (error.code === 'auth/email-already-in-use') msg = "Email already in use";
        if (error.code === 'auth/weak-password') msg = "Password should be at least 6 characters";
        onNotify(msg, "error");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-exchango-success/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
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
            <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="mt-2 text-sm text-gray-400">Join the future of decentralized trading</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            
            <div className="group">
              <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 group-focus-within:text-exchango-accent transition-colors">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-[#0B0E14] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-exchango-accent focus:ring-1 focus:ring-exchango-accent transition-all sm:text-sm"
                  placeholder="Tony Stark"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 group-focus-within:text-exchango-accent transition-colors">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-[#0B0E14] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-exchango-accent focus:ring-1 focus:ring-exchango-accent transition-all sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="group">
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 group-focus-within:text-exchango-accent transition-colors">Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                    </div>
                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-8 py-3 bg-[#0B0E14] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-exchango-accent focus:ring-1 focus:ring-exchango-accent transition-all sm:text-sm"
                    placeholder="••••••"
                    />
                </div>
                </div>

                <div className="group">
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 group-focus-within:text-exchango-accent transition-colors">Confirm</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                    </div>
                    <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-8 py-3 bg-[#0B0E14] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-exchango-accent focus:ring-1 focus:ring-exchango-accent transition-all sm:text-sm"
                    placeholder="••••••"
                    />
                     <div 
                        className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer text-gray-500 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>
                </div>
                </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreed"
                  name="agreed"
                  type="checkbox"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="h-4 w-4 rounded bg-[#0B0E14] border-gray-600 text-exchango-accent focus:ring-exchango-accent/50 focus:ring-offset-0"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreed" className="font-medium text-gray-400">
                  I agree to the <a href="#" className="text-exchango-accent hover:underline">Terms</a> and <a href="#" className="text-exchango-accent hover:underline">Privacy Policy</a>
                </label>
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
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <button type="button" onClick={() => onNavigate('login')} className="font-bold text-white hover:text-exchango-accent transition-colors">
                  Log in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};