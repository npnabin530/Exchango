import React, { useMemo } from 'react';

interface TradingChartProps {
  symbol: string;
  color: string;
  currentPrice: number;
  timeframe: string;
}

export const TradingChart: React.FC<TradingChartProps> = ({ symbol, color, currentPrice, timeframe }) => {
  // Generate simulated chart data based on current price and timeframe
  const chartData = useMemo(() => {
    const points = 100;
    const data = [];
    let price = currentPrice;
    
    // Adjust volatility based on timeframe
    let volatility = 0.002; // Default 1H
    if (timeframe === '4H') volatility = 0.005;
    if (timeframe === '1D') volatility = 0.015;
    if (timeframe === '1W') volatility = 0.04;

    for (let i = 0; i < points; i++) {
      // Random walk with momentum
      const change = (Math.random() - 0.5) * (currentPrice * volatility);
      price += change;
      data.unshift(price);
    }
    
    // Ensure the last point matches current price for visual continuity
    data[data.length - 1] = currentPrice;
    
    return data;
  }, [symbol, timeframe, currentPrice]); // Re-generate when these change

  const min = Math.min(...chartData);
  const max = Math.max(...chartData);
  const range = max - min || 1; // Avoid divide by zero
  const height = 300;
  const width = 800;

  // Create SVG path
  const pathD = chartData.map((price, index) => {
    const x = (index / (chartData.length - 1)) * width;
    const y = height - ((price - min) / range) * (height * 0.8) - (height * 0.1); 
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');

  // Create Area fill path
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="w-full h-full relative overflow-hidden group">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full transition-all duration-500 ease-in-out"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur stdDeviation="2" result="blur" />
             <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid Lines */}
        {[0.2, 0.4, 0.6, 0.8].map(p => (
          <line 
            key={p} 
            x1="0" y1={height * p} 
            x2={width} y2={height * p} 
            stroke="rgba(255,255,255,0.05)" 
            strokeDasharray="4 4" 
          />
        ))}

        {/* Area Fill */}
        <path d={areaD} fill={`url(#gradient-${symbol})`} className="transition-all duration-300" />

        {/* Line Chart */}
        <path 
          d={pathD} 
          fill="none" 
          stroke={color} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all duration-300"
        />
        
        {/* Pulsing Dot at the end */}
        <circle 
          cx={width} 
          cy={height - ((chartData[chartData.length - 1] - min) / range) * (height * 0.8) - (height * 0.1)} 
          r="4" 
          fill="#fff"
          className="animate-pulse"
        />
      </svg>
      
      {/* Dynamic Tooltip Overlay */}
      <div className="absolute top-4 left-4 font-mono text-xs text-gray-400 pointer-events-none bg-black/40 backdrop-blur px-2 py-1.5 rounded-lg border border-white/5">
         <div className="flex justify-between gap-4">
            <span>HIGH</span>
            <span className="text-white">{max.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
         </div>
         <div className="flex justify-between gap-4">
            <span>LOW</span>
            <span className="text-white">{min.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
         </div>
      </div>
    </div>
  );
};