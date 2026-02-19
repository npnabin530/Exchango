import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Hero } from './components/Hero';
import { Converter } from './components/Converter';
import { MarketTable } from './components/MarketTable';
import { Logo } from './components/Logo';
import { Currency } from './types';
import { fetchCryptoRates, fetchFiatRates } from './services/api';
import { REFRESH_INTERVAL, MAJOR_FIAT_CURRENCIES } from './constants';
import { Github, Twitter, WifiOff } from 'lucide-react';

const App: React.FC = () => {
  const [allCurrencies, setAllCurrencies] = useState<Currency[]>([]);
  const [cryptoCurrencies, setCryptoCurrencies] = useState<Currency[]>([]);
  const [fiatCurrencies, setFiatCurrencies] = useState<Currency[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  
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
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => loadData(false), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  const topCrypto = cryptoCurrencies.slice(0, 10);
  const majorFiat = fiatCurrencies.filter(c => 
    MAJOR_FIAT_CURRENCIES.some(m => m.code === c.code)
  ).sort((a, b) => a.code.localeCompare(b.code));

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-exchango-accent/30 font-sans flex flex-col">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0B0E14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Logo Container */}
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
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Trade</a>
            <a href="#" className="hover:text-white transition-colors">Markets</a>
            <a href="#" className="hover:text-white transition-colors">Earn</a>
            <a href="#" className="hover:text-white transition-colors">Learn</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/5">
              Log In
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Fallback Banner */}
      {isFallback && (
        <div className="fixed bottom-0 left-0 w-full bg-yellow-600/20 backdrop-blur-md border-t border-yellow-500/20 z-50 py-2 px-4 flex items-center justify-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-widest animate-fade-in-up">
          <WifiOff size={14} />
          <span>Live updates paused - Displaying cached market data</span>
        </div>
      )}

      <main className="flex-grow pt-24 relative">
        <Hero />
        
        <div className="relative z-20 -mt-8 mb-24">
          <Converter 
            currencies={allCurrencies} 
            lastUpdated={lastUpdated} 
            onRefresh={() => loadData(false)}
            isLoading={loading}
            isFallback={isFallback}
          />
        </div>

        {/* Market Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mb-10 text-center sm:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Market Overview</h2>
            <p className="text-gray-400">Track the top assets across the decentralized economy.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MarketTable 
              title="Top Movers" 
              currencies={topCrypto} 
              type="crypto" 
            />
            <MarketTable 
              title="Fiat Rates" 
              currencies={majorFiat} 
              type="fiat" 
            />
          </div>
        </section>
      </main>

      {/* Footer */}
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
    </div>
  );
};

export default App;