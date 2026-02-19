import React, { useState, useMemo } from 'react';
import { ArrowDown, Settings, Info, RefreshCw, Clock, AlertTriangle, Wallet } from 'lucide-react';
import { Currency } from '../types';

interface ConverterProps {
  currencies: Currency[];
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
  isFallback: boolean;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const Converter: React.FC<ConverterProps> = ({ currencies, lastUpdated, onRefresh, isLoading, isFallback, onNotify }) => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('BTC');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  const sortedCurrencies = useMemo(() => {
    return [...currencies].sort((a, b) => {
      if (a.type === b.type) return a.code.localeCompare(b.code);
      return a.type === 'fiat' ? -1 : 1;
    });
  }, [currencies]);

  const fromCurrency = currencies.find(c => c.code === fromCode);
  const toCurrency = currencies.find(c => c.code === toCode);

  const result = useMemo(() => {
    if (!fromCurrency || !toCurrency) return 0;
    const val = (amount * fromCurrency.rateInUSD) / toCurrency.rateInUSD;
    return val;
  }, [amount, fromCurrency, toCurrency]);

  const exchangeRate = useMemo(() => {
    if (!fromCurrency || !toCurrency) return 0;
    return fromCurrency.rateInUSD / toCurrency.rateInUSD;
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const handleConnectWallet = () => {
    if (!isWalletConnected) {
      setIsWalletConnected(true);
      onNotify("Wallet connected successfully", "success");
    } else {
      setIsWalletConnected(false);
      onNotify("Wallet disconnected", "info");
    }
  };

  const formatResult = (val: number) => {
    if (val === 0) return '0.00';
    if (val < 0.000001) return val.toExponential(4);
    if (val < 0.01) return val.toFixed(6);
    if (val < 1) return val.toFixed(4);
    return val.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const formatCurrencyValue = (val: number) => {
     return val.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  };

  return (
    <div className="relative z-20 mx-auto max-w-[480px] px-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="glass-panel rounded-3xl p-4 sm:p-6 relative border-t border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Exchange
          </h2>
          <div className="flex items-center gap-3 text-gray-400">
             <button 
               onClick={onRefresh} 
               className={`p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors ${isLoading ? 'animate-spin text-exchango-accent' : ''}`}
               title="Refresh Rates"
             >
               <RefreshCw size={16} />
             </button>
             <button className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors">
               <Settings size={16} />
             </button>
          </div>
        </div>

        {/* FROM INPUT */}
        <div className="bg-[#0B0E14]/40 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors group relative">
          <label className="block text-gray-400 text-xs font-medium mb-2 pl-1">You Pay</label>
          
          <div className="flex justify-between items-center gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="bg-transparent text-3xl sm:text-4xl font-medium text-white placeholder-gray-600 focus:outline-none w-full min-w-0"
              placeholder="0"
            />
            
            <div className="relative shrink-0 group/select">
               <div className="flex items-center gap-2 bg-white/5 group-hover/select:bg-white/10 border border-white/5 rounded-full pl-2 pr-4 py-2 cursor-pointer transition-all">
                  {fromCurrency?.image ? (
                    <img src={fromCurrency.image} alt={fromCode} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                  )}
                  <span className="font-bold text-lg text-white">{fromCode}</span>
                  <ArrowDown size={14} className="text-gray-400" />
               </div>

               <select
                 value={fromCode}
                 onChange={(e) => setFromCode(e.target.value)}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               >
                 {sortedCurrencies.map((c) => (
                   <option key={`from-${c.code}`} value={c.code} className="text-black bg-white">
                     {c.code} - {c.name}
                   </option>
                 ))}
               </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2 px-1">
             <div className="text-gray-500 text-xs font-mono">
               ${formatCurrencyValue(amount * (fromCurrency?.rateInUSD || 0))} USD
             </div>
          </div>
        </div>

        {/* SWAP ICON */}
        <div className="relative h-4 -my-3.5 z-10 flex justify-center">
          <button 
            onClick={handleSwap}
            className="bg-[#1E232E] border-[4px] border-[#13161C] rounded-xl p-2.5 text-exchango-accent hover:scale-110 hover:text-white hover:border-[#1E232E] transition-all shadow-xl group"
          >
            <ArrowDown size={18} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* TO INPUT */}
        <div className="bg-[#0B0E14]/40 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors relative">
          <label className="block text-gray-400 text-xs font-medium mb-2 pl-1">You Receive</label>
          
          <div className="flex justify-between items-center gap-4">
             <div className="text-3xl sm:text-4xl font-medium text-exchango-accent w-full overflow-hidden text-ellipsis">
               {formatResult(result)}
             </div>
             
             <div className="relative shrink-0 group/select">
               <div className="flex items-center gap-2 bg-white/5 group-hover/select:bg-white/10 border border-white/5 rounded-full pl-2 pr-4 py-2 cursor-pointer transition-all">
                  {toCurrency?.image ? (
                    <img src={toCurrency.image} alt={toCode} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                  )}
                  <span className="font-bold text-lg text-white">{toCode}</span>
                  <ArrowDown size={14} className="text-gray-400" />
               </div>

               <select
                 value={toCode}
                 onChange={(e) => setToCode(e.target.value)}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               >
                 {sortedCurrencies.map((c) => (
                   <option key={`to-${c.code}`} value={c.code} className="text-black bg-white">
                     {c.code} - {c.name}
                   </option>
                 ))}
               </select>
             </div>
          </div>
          
          <div className="flex justify-between items-center mt-2 px-1">
            <div className="text-gray-500 text-xs font-mono">
               ${formatCurrencyValue(result * (toCurrency?.rateInUSD || 0))} USD
            </div>
          </div>
        </div>

        {/* Rate Info & Fallback Warning */}
        <div className={`mt-4 px-3 py-3 rounded-xl border flex justify-between items-center transition-colors ${
          isFallback 
            ? 'bg-yellow-500/10 border-yellow-500/20' 
            : 'bg-exchango-accent/5 border-exchango-accent/10'
        }`}>
           <div className={`flex items-center gap-2 text-sm font-semibold ${isFallback ? 'text-yellow-500' : 'text-exchango-accent'}`}>
             {isFallback ? <AlertTriangle size={16} /> : <Info size={16} />}
             <span>1 {fromCode} = {formatResult(exchangeRate)} {toCode}</span>
           </div>
           
           <div className="flex items-center gap-1.5 text-xs text-gray-500">
             <Clock size={12} />
             <span>{lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
           </div>
        </div>
        
        {isFallback && (
          <div className="mt-2 text-center">
            <span className="text-[10px] text-yellow-500/70 font-medium uppercase tracking-wide">
              Live API Limit Reached • Showing Cached Data
            </span>
          </div>
        )}

        <button 
          onClick={handleConnectWallet}
          className={`w-full mt-6 font-bold text-lg py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] relative overflow-hidden group flex items-center justify-center gap-2 ${
            isWalletConnected 
            ? 'bg-[#1E232E] text-white border border-white/10' 
            : 'bg-gradient-to-r from-exchango-accent to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-[0_0_20px_rgba(0,209,255,0.2)] hover:shadow-[0_0_30px_rgba(0,209,255,0.4)]'
          }`}
        >
          {isWalletConnected ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>0x71...3A9B</span>
            </>
          ) : (
            <>
              <span className="relative z-10">Connect Wallet</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};