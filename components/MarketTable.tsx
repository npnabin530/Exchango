import React from 'react';
import { Currency } from '../types';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface MarketTableProps {
  title: string;
  currencies: Currency[];
  type: 'crypto' | 'fiat';
}

export const MarketTable: React.FC<MarketTableProps> = ({ title, currencies, type }) => {
  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[600px] border border-white/5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-semibold text-xl text-white tracking-tight">{title}</h3>
        <button className="text-xs font-medium text-gray-400 hover:text-white transition-colors border border-white/10 rounded-full px-3 py-1">View All</button>
      </div>
      
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#0B0E14]/80 backdrop-blur sticky top-0 z-10 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500">Name</th>
              <th className="px-6 py-4 text-right font-medium text-gray-500">Price</th>
              {type === 'crypto' && <th className="px-6 py-4 text-right font-medium text-gray-500">Change</th>}
              <th className="px-6 py-4 text-right font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currencies.map((currency) => {
              const isPositive = (currency.change24h || 0) >= 0;
              
              return (
                <tr key={currency.code} className="glass-card-hover group cursor-pointer">
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
                        <div className="font-bold text-white text-base group-hover:text-exchango-accent transition-colors">{currency.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{currency.code}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="text-white font-medium text-base tracking-wide">
                    {type === 'fiat' ? (
                       `$${currency.rateInUSD < 0.01 ? currency.rateInUSD.toExponential(2) : currency.rateInUSD.toFixed(currency.rateInUSD < 1 ? 4 : 2)}`
                    ) : (
                      `$${currency.rateInUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                    )}
                    </div>
                  </td>
                  
                  {type === 'crypto' && (
                    <td className="px-6 py-4 text-right">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isPositive ? 'bg-green-500/10 text-exchango-success' : 'bg-red-500/10 text-exchango-danger'}`}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(currency.change24h || 0).toFixed(2)}%
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-exchango-accent hover:text-black transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};