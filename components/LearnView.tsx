import React from 'react';
import { BookOpen, Play, Award, Clock, Star, ArrowRight } from 'lucide-react';

interface LearnViewProps {
    onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onNotify }) => {
  const articles = [
    {
      category: 'Beginner',
      title: 'What is Blockchain Technology?',
      desc: 'The fundamental concepts behind decentralized ledgers explained simply.',
      time: '5 min read',
      level: 'Easy',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600'
    },
    {
      category: 'Trading',
      title: 'Reading Candlestick Patterns',
      desc: 'Learn to identify bullish and bearish trends using price action charts.',
      time: '12 min read',
      level: 'Medium',
      image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=600'
    },
    {
      category: 'DeFi',
      title: 'Understanding Yield Farming',
      desc: 'How liquidity providers earn fees and rewards in decentralized exchanges.',
      time: '8 min read',
      level: 'Hard',
      image: 'https://images.unsplash.com/photo-1620321023374-d1a68fddadb3?auto=format&fit=crop&q=80&w=600'
    },
    {
      category: 'Security',
      title: 'Protecting Your Private Keys',
      desc: 'Essential security practices to keep your digital assets safe from theft.',
      time: '6 min read',
      level: 'Easy',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const handleStartCourse = (title: string) => {
      onNotify(`Enrolled in "${title}" successfully`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Hero Header */}
      <div className="text-center mb-16 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-exchango-accent/10 blur-[100px] rounded-full pointer-events-none"></div>
         <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 relative z-10">Exchango Academy</h1>
         <p className="text-gray-400 max-w-2xl mx-auto text-lg relative z-10">
           Master the markets. From blockchain basics to advanced trading strategies, elevate your financial IQ.
         </p>
      </div>

      {/* Progress Section */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-black shadow-lg">
              <Award size={32} />
           </div>
           <div>
              <h3 className="font-bold text-white text-lg">Welcome back, Boss.</h3>
              <p className="text-sm text-gray-400">You've completed 2 of 12 beginner modules.</p>
           </div>
        </div>
        <div className="w-full md:w-1/3">
           <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Progress</span>
              <span>15%</span>
           </div>
           <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-exchango-accent w-[15%] rounded-full shadow-[0_0_10px_#00D1FF]"></div>
           </div>
        </div>
        <button className="px-6 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors whitespace-nowrap">
           Resume Learning
        </button>
      </div>

      {/* Featured Video */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
           <Play size={24} className="text-exchango-purple" /> Featured Course
        </h2>
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 grid grid-cols-1 lg:grid-cols-2">
           <div className="h-64 lg:h-auto relative group cursor-pointer overflow-hidden">
              <img src="https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Featured" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                 <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                    <Play size={24} className="text-white fill-white ml-1" />
                 </div>
              </div>
           </div>
           <div className="p-8 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 rounded-full bg-exchango-purple/20 text-exchango-purple text-xs font-bold mb-4 w-fit">
                 CRYPTO BASICS
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">The Evolution of Money</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                 Explore the history of currency from barter systems to gold standards, and discover why cryptocurrency is the inevitable next step in financial evolution.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
                 <span className="flex items-center gap-1"><Clock size={16} /> 45 mins</span>
                 <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500" /> 4.9 (1.2k)</span>
              </div>
              <button 
                  onClick={() => handleStartCourse("The Evolution of Money")}
                  className="flex items-center gap-2 text-white font-bold hover:text-exchango-accent transition-colors group"
              >
                 Start Course <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>

      {/* Articles Grid */}
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
         <BookOpen size={24} className="text-exchango-accent" /> Latest Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {articles.map((article, index) => (
            <div 
                key={index} 
                onClick={() => onNotify("Opening article...", "info")}
                className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 group cursor-pointer h-full flex flex-col"
            >
               <div className="h-40 overflow-hidden relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur text-[10px] font-bold text-white uppercase tracking-wider">
                     {article.category}
                  </div>
               </div>
               <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-white text-lg mb-2 leading-tight group-hover:text-exchango-accent transition-colors">{article.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{article.desc}</p>
                  
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                     <span className="flex items-center gap-1"><Clock size={12} /> {article.time}</span>
                     <span className={`px-2 py-0.5 rounded ${article.level === 'Easy' ? 'bg-green-500/10 text-green-400' : article.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                        {article.level}
                     </span>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};