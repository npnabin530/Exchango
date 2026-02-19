import React, { useState, useEffect, useMemo } from 'react';
import { Currency } from '../types';
import { TradingChart } from './TradingChart';
import { ArrowDown, ChevronDown, Wallet } from 'lucide-react';

interface TradeViewProps {
  currencies: Currency[];
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

// Local mock wallet
const INITIAL_BALANCES: Record<string, number> = {
  USD: 14250.00,
  BTC: 0.45,
  ETH: 12.5,
  SOL: 150,
};

export const TradeView: React.FC<TradeViewProps> = ({ currencies, onNotify }) => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [timeframe, setTimeframe] = useState('1H');
  const [amount, setAmount] = useState('');
  
  // Portfolio State
  const [balances, setBalances] = useState<Record<string, number>>(INITIAL_BALANCES);
  const [isProcessing, setIsProcessing] = useState(false);

  const cryptoCurrencies = currencies.filter(c => c.type === 'crypto');
  const activeCurrency: Currency = cryptoCurrencies.find(c => c.code === selectedSymbol) || cryptoCurrencies[0] || {
    code: 'BTC', 
    name: 'Bitcoin', 
    type: 'crypto', 
    rateInUSD: 65000, 
    change24h: 0,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
  };

  // Simulated Live Price (Smooth Ticker)
  const [livePrice, setLivePrice] = useState(activeCurrency.rateInUSD);

  // Sync initial price when symbol changes
  useEffect(() => {
    setLivePrice(activeCurrency.rateInUSD);
    setAmount(''); // Reset input on symbol change
  }, [activeCurrency.rateInUSD, selectedSymbol]);

  // Simulate ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrice(prev => {
        const change = prev * (Math.random() - 0.5) * 0.002; // 0.1% volatility
        return prev + change;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const isPositive = (activeCurrency.change24h || 0) >= 0;
  const color = isPositive ? '#00E096' : '#FF3B30';

  // Dynamic Order Book Data based on livePrice
  const { asks, bids } = useMemo(() => {
    const generate = (price: number, type: 'asks' | 'bids') => {
      return Array.from({ length: 7 }).map((_, i) => {
        const spread = type === 'asks' ? 1 : -1;
        // Deterministic but dynamic looking
        const p = price * (1 + (spread * (i + 1) * 0.001));
        const size = (Math.sin(Date.now() / 1000 + i) + 2); // Pulsing size
        return { price: p, size: parseFloat(size.toFixed(4)) };
      });
    };
    return {
      asks: generate(livePrice, 'asks').reverse(),
      bids: generate(livePrice, 'bids')
    };
  }, [livePrice]);

  const handlePercentageClick = (pct: number) => {
    if (side === 'buy') {
      const usdBalance = balances['USD'] || 0;
      const budget = usdBalance * (pct / 100);
      const calculatedAmount = budget / livePrice;
      setAmount(calculatedAmount.toFixed(6));
    } else {
      const cryptoBalance = balances[activeCurrency.code] || 0;
      const calculatedAmount = cryptoBalance * (pct / 100);
      setAmount(calculatedAmount.toFixed(6));
    }
  };

  const handleTrade = () => {
    const qty = parseFloat(amount);
    if (!qty || qty <= 0) {
      onNotify("Please enter a valid amount", "error");
      return;
    }

    setIsProcessing(true);

    // Simulate Network Delay
    setTimeout(() => {
      const totalCost = qty * livePrice;

      if (side === 'buy') {
        if (totalCost > (balances['USD'] || 0)) {
          onNotify("Insufficient USD balance", "error");
          setIsProcessing(false);
          return;
        }
        setBalances(prev => ({
          ...prev,
          USD: prev.USD - totalCost,
          [activeCurrency.code]: (prev[activeCurrency.code] || 0) + qty
        }));
        onNotify(`Successfully bought ${qty} ${activeCurrency.code}`, "success");
      } else {
        if (qty > (balances[activeCurrency.code] || 0)) {
          onNotify(`Insufficient ${activeCurrency.code} balance`, "error");
          setIsProcessing(false);
          return;
        }
        setBalances(prev => ({
          ...prev,
          USD: prev.USD + totalCost,
          [activeCurrency.code]: prev[activeCurrency.code] - qty
        }));
        onNotify(`Successfully sold ${qty} ${activeCurrency.code}`, "success");
      }
      setAmount('');
      setIsProcessing(false);
    }, 800);
  };

  const currentBalance = side === 'buy' ? balances['USD'] : (balances[activeCurrency.code] || 0);
  const currentAssetCode = side === 'buy' ? 'USD' : activeCurrency.code;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Bar: Pair Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group z-30">
             <button className="flex items-center gap-2 text-2xl font-bold text-white hover:text-exchango-accent transition-colors">
               {activeCurrency.image && <img src={activeCurrency.image} alt={activeCurrency.code} className="w-8 h-8 rounded-full" />}
               {activeCurrency.code} / USD
               <ChevronDown size={20} className="text-gray-500" />
             </button>
             {/* Dropdown for currency selection */}
             <div className="absolute top-full left-0 mt-2 w-72 max-h-96 overflow-y-auto bg-[#0B0E14] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 custom-scrollbar">
               {cryptoCurrencies.map(c => (
                 <div 
                   key={c.code}
                   onClick={() => setSelectedSymbol(c.code)}
                   className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 ${selectedSymbol === c.code ? 'bg-white/5' : ''}`}
                 >
                   {c.image && <img src={c.image} alt={c.code} className="w-8 h-8 rounded-full" />}
                   <div className="flex flex-col flex-1">
                     <span className="font-bold text-sm text-white flex justify-between">
                        {c.code}
                        <span className="font-mono">${c.rateInUSD.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                     </span>
                     <span className="text-xs text-gray-500 flex justify-between">
                        {c.name}
                        <span className={(c.change24h || 0) >= 0 ? 'text-exchango-success' : 'text-exchango-danger'}>
                            {(c.change24h || 0).toFixed(2)}%
                        </span>
                     </span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          
          <div className={`px-2.5 py-1 rounded-md text-sm font-semibold transition-colors duration-500 ${isPositive ? 'text-exchango-success bg-exchango-success/10' : 'text-exchango-danger bg-exchango-danger/10'}`}>
            {activeCurrency.change24h?.toFixed(2)}%
          </div>
        </div>

        <div className="flex gap-6 text-sm font-mono text-gray-400">
           <div>
             <span className="block text-xs text-gray-500">24h High</span>
             <span className="text-white">{(livePrice * 1.05).toLocaleString()}</span>
           </div>
           <div>
             <span className="block text-xs text-gray-500">24h Low</span>
             <span className="text-white">{(livePrice * 0.95).toLocaleString()}</span>
           </div>
           <div>
             <span className="block text-xs text-gray-500">24h Volume</span>
             <span className="text-white">{(livePrice * 4500).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-1 flex flex-col relative min-h-[400px]">
           <div className="absolute top-4 right-4 flex gap-2 z-10 bg-black/20 rounded-lg p-1">
             {['1H', '4H', '1D', '1W'].map(t => (
               <button 
                key={t} 
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${timeframe === t ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               >
                 {t}
               </button>
             ))}
           </div>
           <div className="flex-grow p-4">
              <TradingChart 
                symbol={activeCurrency.code} 
                currentPrice={livePrice}
                color={color}
                timeframe={timeframe}
              />
           </div>
        </div>

        {/* Right Sidebar: Order Book & Form */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Order Book */}
          <div className="glass-panel rounded-2xl p-4 flex-1 flex flex-col min-h-[300px]">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex justify-between">
              <span>Order Book</span>
              <span className="text-xs font-normal opacity-50">Spread: 0.2%</span>
            </h3>
            <div className="flex-1 overflow-hidden font-mono text-xs">
              {/* Asks (Red) */}
              <div className="flex flex-col-reverse justify-end gap-0.5 mb-2">
                {asks.map((ask, i) => (
                  <div key={`ask-${i}`} className="flex justify-between py-0.5 relative group cursor-pointer hover:bg-white/5">
                    <span className="text-exchango-danger relative z-10">{ask.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    <span className="text-gray-300 relative z-10">{ask.size.toFixed(4)}</span>
                    <div className="absolute right-0 top-0 bottom-0 bg-exchango-danger/10 transition-all duration-300" style={{width: `${(ask.size / 4) * 100}%`}}></div>
                  </div>
                ))}
              </div>
              
              <div className={`py-3 text-center text-lg font-bold border-y border-white/5 my-1 transition-colors duration-300 ${isPositive ? 'text-exchango-success' : 'text-exchango-danger'}`}>
                {livePrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                <ArrowDown size={14} className={`inline ml-1 ${isPositive ? 'rotate-180' : ''}`} />
              </div>

              {/* Bids (Green) */}
              <div className="flex flex-col gap-0.5 mt-2">
                {bids.map((bid, i) => (
                  <div key={`bid-${i}`} className="flex justify-between py-0.5 relative group cursor-pointer hover:bg-white/5">
                    <span className="text-exchango-success relative z-10">{bid.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    <span className="text-gray-300 relative z-10">{bid.size.toFixed(4)}</span>
                    <div className="absolute right-0 top-0 bottom-0 bg-exchango-success/10 transition-all duration-300" style={{width: `${(bid.size / 4) * 100}%`}}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Form */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex p-1 bg-black/20 rounded-lg mb-4">
              <button 
                onClick={() => setSide('buy')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200 ${side === 'buy' ? 'bg-exchango-success text-black shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white'}`}
              >
                Buy
              </button>
              <button 
                onClick={() => setSide('sell')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200 ${side === 'sell' ? 'bg-exchango-danger text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white'}`}
              >
                Sell
              </button>
            </div>

            <div className="flex gap-4 mb-4 text-xs font-medium text-gray-400">
               <button onClick={() => setOrderType('limit')} className={`pb-1 border-b-2 transition-colors ${orderType === 'limit' ? 'text-white border-exchango-accent' : 'border-transparent hover:text-white'}`}>Limit</button>
               <button onClick={() => setOrderType('market')} className={`pb-1 border-b-2 transition-colors ${orderType === 'market' ? 'text-white border-exchango-accent' : 'border-transparent hover:text-white'}`}>Market</button>
            </div>

            <div className="space-y-3">
               <div>
                 <label className="text-xs text-gray-500 mb-1 block">Price (USD)</label>
                 <div className="bg-[#0B0E14] border border-white/10 rounded-lg px-3 py-2 flex justify-between items-center focus-within:border-exchango-accent focus-within:bg-[#0B0E14]/80 transition-all">
                    <input 
                      type="number" 
                      className="bg-transparent w-full text-white text-sm focus:outline-none" 
                      placeholder="0.00" 
                      value={livePrice.toFixed(2)}
                      readOnly
                    />
                    <span className="text-xs text-gray-500">USD</span>
                 </div>
               </div>
               
               <div>
                 <label className="text-xs text-gray-500 mb-1 block">Amount ({activeCurrency.code})</label>
                 <div className="bg-[#0B0E14] border border-white/10 rounded-lg px-3 py-2 flex justify-between items-center focus-within:border-exchango-accent focus-within:bg-[#0B0E14]/80 transition-all">
                    <input 
                      type="number" 
                      className="bg-transparent w-full text-white text-sm focus:outline-none" 
                      placeholder="0.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <span className="text-xs text-gray-500">{activeCurrency.code}</span>
                 </div>
               </div>

               <div className="flex justify-between gap-1 mt-1">
                 {[25, 50, 75, 100].map(pct => (
                   <button 
                    key={pct} 
                    onClick={() => handlePercentageClick(pct)} 
                    className="flex-1 bg-white/5 hover:bg-white/10 hover:text-white text-[10px] text-gray-400 py-1.5 rounded transition-colors"
                   >
                     {pct}%
                   </button>
                 ))}
               </div>

               <div className="pt-2">
                 <div className="flex justify-between text-xs text-gray-400 mb-2 items-center">
                   <span className="flex items-center gap-1"><Wallet size={12}/> Avail. {currentAssetCode}</span>
                   <span className="text-white font-mono">{currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})}</span>
                 </div>
                 <button 
                   onClick={handleTrade}
                   disabled={isProcessing}
                   className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg active:scale-[0.98] transition-all relative overflow-hidden ${
                       side === 'buy' 
                        ? 'bg-exchango-success text-black hover:bg-[#00c985]' 
                        : 'bg-exchango-danger text-white hover:bg-[#e0332a]'
                   } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                 >
                   {isProcessing ? (
                       <span className="flex items-center justify-center gap-2">
                           <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                           Processing...
                       </span>
                   ) : (
                       `${side === 'buy' ? 'Buy' : 'Sell'} ${activeCurrency.code}`
                   )}
                 </button>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};