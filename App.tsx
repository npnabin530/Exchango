import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Hero } from './components/Hero';
import { Converter } from './components/Converter';
import { MarketTable } from './components/MarketTable';
import { TradeView } from './components/TradeView';
import { EarnView } from './components/EarnView';
import { LearnView } from './components/LearnView';
import { LoginView } from './components/LoginView';
import { SignUpView } from './components/SignUpView';
import { ProfileView } from './components/ProfileView';
import { Toast } from './components/Toast';
import { Logo } from './components/Logo';
import { Currency, User } from './types';
import { fetchCryptoRates, fetchFiatRates } from './services/api';
import { REFRESH_INTERVAL, MAJOR_FIAT_CURRENCIES } from './constants';
import { Github, Twitter, WifiOff, BarChart2, Home, Wallet, BookOpen, User as UserIcon } from 'lucide-react';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface NotificationState {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
}

type ViewType = 'home' | 'trade' | 'earn' | 'learn' | 'login' | 'signup' | 'profile';

const App: React.FC = () => {
  const [allCurrencies, setAllCurrencies] = useState<Currency[]>([]);
  const [cryptoCurrencies, setCryptoCurrencies] = useState<Currency[]>([]);
  const [fiatCurrencies, setFiatCurrencies] = useState<Currency[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewType>('home');
  // View State for Markets
  const [viewAllCrypto, setViewAllCrypto] = useState(false);
  
  // Notification State
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: 'info' });

  // Helper to show notification
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
      setNotification({ show: true, message, type });
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            const creationTime = firebaseUser.metadata.creationTime;
            const memberSince = creationTime 
                ? new Date(creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
                : 'Dec 2023';

            setUser({
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                email: firebaseUser.email || '',
                avatar: firebaseUser.photoURL || undefined,
                memberSince: memberSince,
                id: firebaseUser.uid
            });
        } else {
            setUser(null);
        }
        setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Auth Handlers
  const handleLogin = (userData: Partial<User>) => {
      // Logic handled by onAuthStateChanged
      setCurrentView('home');
  };

  const handleLogout = async () => {
      try {
        await signOut(auth);
        setUser(null);
        setCurrentView('home');
        showNotification("Logged out successfully", "info");
      } catch (error: any) {
        showNotification("Logout failed: " + error.message, "error");
      }
  };
  
  // Concurrency control to prevent duplicate requests
  const isFetchingRef = useRef(false);

  const loadData = useCallback(async (isInitial = false) => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    if (isInitial) setLoading(true);
    
    try {
      // Parallel robust fetching
      const [fiatRes, cryptoRes] = await Promise.all([
        fetchFiatRates(),
        fetchCryptoRates()
      ]);

      const enrichedFiat = fiatRes.data.map(c => {
        const major = MAJOR_FIAT_CURRENCIES.find(m => m.code === c.code);
        return major ? { ...c, name: major.name } : c;
      });

      setFiatCurrencies(enrichedFiat);
      setCryptoCurrencies(cryptoRes.data);
      setAllCurrencies([...enrichedFiat, ...cryptoRes.data]);
      
      // Determine if we are in fallback mode
      const isFallbackData = fiatRes.isFallback || cryptoRes.isFallback;
      setIsFallback(isFallbackData);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Critical Data Error:", error);
      showNotification("Failed to fetch live data", "error");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [showNotification]);

  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => loadData(false), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  // View logic for market table
  const displayedCrypto = viewAllCrypto ? cryptoCurrencies : cryptoCurrencies.slice(0, 10);
  const majorFiat = fiatCurrencies.filter(c => 
    MAJOR_FIAT_CURRENCIES.some(m => m.code === c.code)
  ).sort((a, b) => a.code.localeCompare(b.code));

  // Render content based on view
  const renderContent = () => {
      if (authLoading && (currentView === 'profile' || currentView === 'login' || currentView === 'signup')) {
          return (
              <div className="flex h-screen items-center justify-center">
                  <div className="w-8 h-8 border-4 border-exchango-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
          );
      }

      switch (currentView) {
          case 'login':
              return <LoginView onNavigate={setCurrentView} onNotify={showNotification} onLogin={handleLogin} />;
          case 'signup':
              return <SignUpView onNavigate={setCurrentView} onNotify={showNotification} onLogin={handleLogin} />;
          case 'profile':
              return user ? (
                <ProfileView user={user} onLogout={handleLogout} onNotify={showNotification} />
              ) : (
                <LoginView onNavigate={setCurrentView} onNotify={showNotification} onLogin={handleLogin} />
              );
          case 'trade':
              return <TradeView currencies={allCurrencies} onNotify={showNotification} />;
          case 'earn':
              return <EarnView onNotify={showNotification} />;
          case 'learn':
              return <LearnView onNotify={showNotification} />;
          case 'home':
          default:
              return (
                <>
                  <Hero />
                  <div className="relative z-20 -mt-8 mb-24">
                    <Converter 
                      currencies={allCurrencies} 
                      lastUpdated={lastUpdated} 
                      onRefresh={() => loadData(false)}
                      isLoading={loading}
                      isFallback={isFallback}
                      onNotify={showNotification}
                    />
                  </div>
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                    <div className="mb-10 text-center sm:text-left">
                      <h2 className="text-3xl font-bold text-white mb-2">Market Overview</h2>
                      <p className="text-gray-400">Track the top assets across the decentralized economy.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <MarketTable 
                        title={viewAllCrypto ? "All Assets" : "Top Movers"} 
                        currencies={displayedCrypto} 
                        type="crypto" 
                        onViewAll={() => setViewAllCrypto(!viewAllCrypto)}
                        isExpanded={viewAllCrypto}
                      />
                      <MarketTable 
                        title="Fiat Rates" 
                        currencies={majorFiat} 
                        type="fiat" 
                      />
                    </div>
                  </section>
                </>
              );
      }
  };

  const isAuthView = currentView === 'login' || currentView === 'signup';

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-exchango-accent/30 font-sans flex flex-col">
      
      {/* Toast Notification */}
      {notification.show && (
          <Toast 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(prev => ({ ...prev, show: false }))} 
          />
      )}

      {/* Navbar - Simplified on Auth pages */}
      {!isAuthView && (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0B0E14]/80 backdrop-blur-xl transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div 
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => setCurrentView('home')}
            >
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-exchango-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Logo className="w-12 h-12" />
                </div>
                <div>
                <span className="font-bold text-2xl tracking-tight text-white block">
                    Exchango
                </span>
                </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-400 bg-white/5 rounded-full p-1.5 border border-white/5">
                <button 
                onClick={() => setCurrentView('trade')}
                className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${currentView === 'trade' ? 'bg-white text-black font-bold shadow-lg' : 'hover:text-white hover:bg-white/5'}`}
                >
                <BarChart2 size={16} /> Trade
                </button>
                <button 
                onClick={() => setCurrentView('home')}
                className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${currentView === 'home' ? 'bg-white text-black font-bold shadow-lg' : 'hover:text-white hover:bg-white/5'}`}
                >
                <Home size={16} /> Markets
                </button>
                <button 
                onClick={() => setCurrentView('earn')}
                className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${currentView === 'earn' ? 'bg-white text-black font-bold shadow-lg' : 'hover:text-white hover:bg-white/5'}`}
                >
                <Wallet size={16} /> Earn
                </button>
                <button 
                onClick={() => setCurrentView('learn')}
                className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${currentView === 'learn' ? 'bg-white text-black font-bold shadow-lg' : 'hover:text-white hover:bg-white/5'}`}
                >
                <BookOpen size={16} /> Learn
                </button>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                   <button 
                      onClick={() => setCurrentView('profile')}
                      className={`flex items-center gap-3 px-2 py-1.5 pr-4 rounded-full transition-all border border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10 ${currentView === 'profile' ? 'bg-white/10 border-white/20' : ''}`}
                   >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-exchango-accent to-blue-600 flex items-center justify-center text-black font-bold text-sm overflow-hidden">
                         {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm hidden sm:block">{user.name}</span>
                   </button>
                ) : (
                   <>
                      <button 
                          onClick={() => setCurrentView('login')}
                          className="hidden sm:block px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/5"
                      >
                      Log In
                      </button>
                      <button 
                          onClick={() => setCurrentView('signup')}
                          className="px-5 py-2.5 rounded-xl bg-exchango-accent text-black font-bold hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,209,255,0.3)]"
                      >
                      Sign Up
                      </button>
                   </>
                )}
            </div>
            </div>
        </nav>
      )}

      {/* Fallback Banner */}
      {isFallback && !isAuthView && (
        <div className="fixed bottom-0 left-0 w-full bg-yellow-600/20 backdrop-blur-md border-t border-yellow-500/20 z-50 py-2 px-4 flex items-center justify-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-widest animate-fade-in-up">
          <WifiOff size={14} />
          <span>Live updates paused - Displaying cached market data</span>
        </div>
      )}

      <main className={`flex-grow relative ${!isAuthView ? 'pt-24' : ''}`}>
         {renderContent()}
      </main>

      {/* Footer - Only show on main pages */}
      {!isAuthView && (
        <footer className="border-t border-white/5 bg-[#050608] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-75 hover:opacity-100 transition-opacity">
                <Logo className="w-8 h-8 opacity-70" />
                <span className="font-bold tracking-widest text-sm text-gray-400">EXCHANGO</span>
            </div>
            <div className="flex gap-8 text-gray-500">
                <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
            </div>
        </footer>
      )}
    </div>
  );
};

export default App;