import React from 'react';
import { TrendingUp, Lock, Wallet, ShieldCheck, ChevronRight } from 'lucide-react';

interface EarnViewProps {
    onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const EarnView: React.FC<EarnViewProps> = ({ onNotify }) => {
  const stakingPools = [
    { asset: 'USDT', name: 'Tether', apy: 12.5, duration: 'Flexible', tvl: '450M', risk: 'Low', color: '#26A17B' },
    { asset: 'ETH', name: 'Ethereum', apy: 5.2, duration: '30 Days', tvl: '1.2B', risk: 'Medium', color: '#627EEA' },
    { asset: 'DOT', name: 'Polkadot', apy: 14.8, duration: '90 Days', tvl: '210M', risk: 'High', color: '#E6007A' },
    { asset: 'SOL', name: 'Solana', apy: 7.4, duration: 'Flexible', tvl: '890M', risk: 'Medium', color: '#00FFA3' },
    { asset: 'USDC', name: 'USD Coin', apy: 8.1, duration: 'Flexible', tvl: '600M', risk: 'Low', color: '#2775CA' },
  ];

  const handleStake = (asset: string, apy: number) => {
      onNotify(`Staking initiated for ${asset} at ${apy}% APY`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={80} />
          </div>
          <div className="text-gray-400 text-sm font-medium mb-1">Total Value Locked</div>
          <div className="text-3xl font-bold text-white">$4,250,890.00</div>
          <div className="text-exchango-success text-xs mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> +2.4% this week
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingUp size={80} />
          </div>
          <div className="text-gray-400 text-sm font-medium mb-1">Total Earnings Paid</div>
          <div className="text-3xl font-bold text-white">$142,050.55</div>
          <div className="text-gray-500 text-xs mt-2">Paid out to stakers</div>
        </div>

        <div className="bg-gradient-to-br from-exchango-purple to-blue-600 p-6 rounded-2xl relative overflow-hidden text-white shadow-[0_0_30px_rgba(140,79,255,0.3)]">
           <div className="relative z-10">
             <div className="text-white/80 text-sm font-medium mb-1">Your Staking Balance</div>
             <div className="text-3xl font-bold">$0.00</div>
             <button onClick={() => onNotify("Wallet not connected. Go to Home to connect.", "info")} className="mt-4 px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors">
               Start Earning
             </button>
           </div>
           <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Active Pools</h2>
        <div className="flex gap-2">
           <button className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm hover:bg-white/10 transition-colors border border-white/5">Stablecoins</button>
           <button className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm hover:bg-white/10 transition-colors border border-white/5">High Yield</button>
        </div>
      </div>

      {/* Pools List */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium">Est. APY</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">TVL</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stakingPools.map((pool) => (
                <tr key={pool.asset} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg" style={{ backgroundColor: pool.color }}>
                        {pool.asset[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white">{pool.asset}</div>
                        <div className="text-xs text-gray-500">{pool.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-exchango-success font-bold text-lg">{pool.apy}%</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-300">
                      {pool.duration === 'Flexible' ? <Wallet size={14} /> : <Lock size={14} />}
                      {pool.duration}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-400">
                    {pool.tvl}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                        onClick={() => handleStake(pool.asset, pool.apy)}
                        className="px-6 py-2 rounded-lg border border-exchango-accent text-exchango-accent font-medium text-sm hover:bg-exchango-accent hover:text-black transition-all"
                    >
                      Stake
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
               <ShieldCheck size={24} />
            </div>
            <div>
               <h3 className="font-bold text-white mb-2">Institutional Grade Security</h3>
               <p className="text-sm text-gray-400 leading-relaxed">
                  Your assets are protected by industry-leading custodians and smart contract audits. We prioritize security above yield.
               </p>
            </div>
         </div>
         <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-white/20 transition-colors">
            <div>
               <h3 className="font-bold text-white mb-1">View Audit Reports</h3>
               <p className="text-sm text-gray-400">Transparency is our core value.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
               <ChevronRight size={20} className="text-white" />
            </div>
         </div>
      </div>
    </div>
  );
};