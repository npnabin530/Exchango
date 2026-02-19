import React from 'react';
import { Currency } from '../types';
import { TrendingUp, TrendingDown, ArrowUpRight, List, Activity, BarChart3 } from 'lucide-react';

interface MarketTableProps {
  title: string;
  currencies: Currency[];
  type: 'crypto' | 'fiat';
  onViewAll?: () => void;
  isExpanded?: boolean;
}

export const MarketTable: React.FC<MarketTableProps> = ({ title, currencies, type, onViewAll, isExpanded }) => {
  
  const formatVolume = (vol?: number) => {
    if (!vol) return '-';
    if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
    return `$${vol.toLocaleString()}`;
  };

  return (
    <div className={`glass-panel rounded-3xl overflow-hidden flex flex-col border border-white/5 animate-fade-in ${isExpanded ? 'h-[800px]' : 'h-[600px]'}`} style={{ animationDelay: '0.4s' }}>
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0B0E14]/40">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-xl text-white tracking-tight">{title}</h3>
          {type === 'crypto' && (
             <span className="flex h-2 w-2 relative ml-1">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
          )}
        </div>
        {onViewAll && (
            <button 
                onClick={onViewAll}
                className={`text-xs font-medium transition-colors border border-white/10 rounded-full px-3 py-1 flex items-center gap-1 ${isExpanded ? 'bg-white text-black hover:bg-gray-200' : 'text-gray-400 hover:text-white'}`}
            >
                {isExpanded ? 'Show Less' : 'View All'}
                {isExpanded && <List size={12} />}
            </button>
        )}
      </div>
      
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#0B0E14]/95 backdrop-blur sticky top-0 z-10 border-b border-white/5 shadow-lg">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Asset</th>
              <th className="px-6 py-4 text-right font-medium text-gray-500 uppercase text-[10px] tracking-wider">Price</th>
              {type === 'crypto' && (
                <>
                  <th className="px-6 py-4 text-right font-medium text-gray-500 uppercase text-[10px] tracking-wider hidden md:table-cell">24h Change</th>
                  <th className="px-6 py-4 text-right font-medium text-gray-500 uppercase text-[10px] tracking-wider hidden lg:table-cell">24h Volume</th>
                  <th className="px-6 py-4 text-right font-medium text-gray-500 uppercase text-[10px] tracking-wider hidden xl:table-cell w-32">24h Range</th>
                </>
              )}
              {type === 'fiat' && (
                 <th className="px-6 py-4 text-right font-medium text-gray-500 uppercase text-[10px] tracking-wider">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currencies.map((currency) => {
              const isPositive = (currency.change24h || 0) >= 0;
              
              // Calculate range position percentage
              let rangePercent = 50;
              if (currency.high24h && currency.low24h && currency.rateInUSD) {
                 const range = currency.high24h - currency.low24h;
                 if (range > 0) {
                    rangePercent = ((currency.rateInUSD - currency.low24h) / range) * 100;
                    rangePercent = Math.max(0, Math.min(100, rangePercent)); // Clamp
                 }
              }

              return (
                <tr key={currency.code} className="hover:bg-white/[0.02] transition-colors group cursor-pointer relative overflow-hidden">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {currency.image ? (
                        <img src={currency.image} alt={currency.code} className="w-9 h-9 rounded-full bg-white/5 p-0.5" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-white">
                          {currency.code.slice(0, 1)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white text-base group-hover:text-exchango-accent transition-colors flex items-center gap-2">
                            {currency.name}
                            {type === 'crypto' && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 font-mono group-hover:bg-exchango-accent/10 group-hover:text-exchango-accent transition-colors`}>
                                    {currency.code}
                                </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="text-white font-medium text-base tracking-wide font-mono">
                    {type === 'fiat' ? (
                       `$${currency.rateInUSD < 0.01 ? currency.rateInUSD.toExponential(2) : currency.rateInUSD.toFixed(currency.rateInUSD < 1 ? 4 : 2)}`
                    ) : (
                      <span className={isPositive ? "text-green-400" : "text-red-400"}>
                        ${currency.rateInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    )}
                    </div>
                  </td>
                  
                  {type === 'crypto' && (
                    <>
                        <td className="px-6 py-4 text-right hidden md:table-cell">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {Math.abs(currency.change24h || 0).toFixed(2)}%
                        </div>
                        </td>
                        
                        <td className="px-6 py-4 text-right hidden lg:table-cell">
                            <div className="text-gray-400 text-sm font-mono flex items-center justify-end gap-1">
                                <BarChart3 size={12} className="opacity-50" />
                                {formatVolume(currency.volume24h)}
                            </div>
                        </td>

                        <td className="px-6 py-4 text-right hidden xl:table-cell">
                            {currency.high24h && currency.low24h ? (
                                <div className="w-24 ml-auto">
                                    <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-mono">
                                        <span>L</span>
                                        <span>H</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                                        <div 
                                            className="absolute top-0 bottom-0 w-2 h-full bg-white rounded-full shadow-[0_0_8px_white]"
                                            style={{ left: `calc(${rangePercent}% - 4px)` }}
                                        ></div>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-gray-600 text-xs">-</span>
                            )}
                        </td>
                    </>
                  )}

                  {type === 'fiat' && (
                     <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-exchango-accent hover:text-black transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                        <ArrowUpRight size={18} />
                        </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};