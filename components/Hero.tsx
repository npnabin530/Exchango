import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative pt-32 pb-6 sm:pt-40 sm:pb-12 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-exchango-purple/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-exchango-accent/10 rounded-full blur-[100px] animate-float"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 animate-fade-in">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-exchango-accent mb-8 hover:bg-white/10 transition-colors cursor-pointer group">
          <Sparkles size={14} className="mr-2 group-hover:rotate-12 transition-transform" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Exchango V2.4 Now Live
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-white mb-6 font-sans">
          The Future of <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-exchango-accent via-white to-exchango-purple">
            Value Exchange
          </span>
        </h1>
        
        <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          Experience the power of Exchango. Instant global settlement for fiat and decentralized assets. 
          Zero latency. Institutional-grade precision.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-transform duration-200">
            Start Trading
          </button>
          <button className="px-8 py-3 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2">
            View Documentation <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};