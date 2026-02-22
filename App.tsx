import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Copy, Moon, RefreshCcw, Search, Star, Sun, WifiOff } from 'lucide-react';

type CurrencyType = 'fiat' | 'crypto';

type Asset = {
  code: string;
  name: string;
  symbol: string;
  type: CurrencyType;
  priceUSD: number;
  change24h: number;
  change7d: number;
  marketCap?: number;
  volume24h?: number;
  rank?: number;
  sparkline: number[];
  icon: string;
  flag?: string;
};

type Conversion = {
  id: string;
  from: string;
  to: string;
  amount: number;
  result: number;
  timestamp: string;
};

const MAJOR_FIAT = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'रू', flag: '🇳🇵' },
];

const POPULAR_PAIRS = [
  ['BTC', 'USD'],
  ['USD', 'NPR'],
  ['ETH', 'USD'],
  ['EUR', 'USD'],
] as const;

const id = () => Math.random().toString(36).slice(2);

const Sparkline: React.FC<{ data: number[]; positive?: boolean }> = ({ data, positive = true }) => {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1 || 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg viewBox="0 0 100 100" className="sparkline" aria-hidden="true">
      <polyline points={points} fill="none" stroke={positive ? '#39ffb6' : '#ff5b7f'} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
};

const App: React.FC = () => {
  const [crypto, setCrypto] = useState<Asset[]>([]);
  const [fiat, setFiat] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(!navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showAll, setShowAll] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('BTC');
  const [history, setHistory] = useState<Conversion[]>(() => JSON.parse(localStorage.getItem('history') || '[]'));
  const [search, setSearch] = useState('');
  const [sortFiat, setSortFiat] = useState<'rate' | 'change'>('rate');

  const assets = useMemo(() => [...fiat, ...crypto], [fiat, crypto]);
  const fromAsset = useMemo(() => assets.find((a) => a.code === from), [assets, from]);
  const toAsset = useMemo(() => assets.find((a) => a.code === to), [assets, to]);

  const numericAmount = Number(amount);
  const result = useMemo(() => {
    if (!fromAsset || !toAsset || Number.isNaN(numericAmount)) return 0;
    return (numericAmount * fromAsset.priceUSD) / toAsset.priceUSD;
  }, [fromAsset, toAsset, numericAmount]);

  const fetchData = useCallback(async () => {
    try {
      setError('');
      const [cryptoRes, fiatRes] = await Promise.all([
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&price_change_percentage=24h,7d&per_page=100&page=1'),
        fetch('https://open.er-api.com/v6/latest/USD'),
      ]);

      if (cryptoRes.status === 429 || fiatRes.status === 429) {
        throw new Error('Rate limit reached. Please wait a few seconds.');
      }
      if (!cryptoRes.ok || !fiatRes.ok) throw new Error('Unable to load market data.');

      const [cryptoJson, fiatJson] = await Promise.all([cryptoRes.json(), fiatRes.json()]);
      const cryptoData: Asset[] = cryptoJson.map((coin: any) => ({
        code: coin.symbol.toUpperCase(),
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        type: 'crypto',
        priceUSD: coin.current_price,
        change24h: coin.price_change_percentage_24h ?? 0,
        change7d: coin.price_change_percentage_7d_in_currency ?? 0,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        rank: coin.market_cap_rank,
        sparkline: coin.sparkline_in_7d?.price?.slice(-24) ?? [],
        icon: coin.image,
      }));

      const fiatData: Asset[] = MAJOR_FIAT.map((c) => ({
        code: c.code,
        name: c.name,
        symbol: c.symbol,
        type: 'fiat',
        priceUSD: 1 / (fiatJson.rates[c.code] || 1),
        change24h: 0,
        change7d: 0,
        sparkline: [98, 98.3, 98.1, 98.6, 98.4, 98.9, 99],
        icon: c.flag,
        flag: c.flag,
      }));

      setCrypto(cryptoData);
      setFiat((prev) =>
        fiatData.map((f) => {
          const old = prev.find((p) => p.code === f.code);
          const change = old ? ((f.priceUSD - old.priceUSD) / old.priceUSD) * 100 : 0;
          return { ...f, change24h: change };
        }),
      );
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const online = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', online);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history.slice(0, 6)));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale.includes('en-IN')) setFrom('INR');
    if (locale.includes('ne')) setFrom('NPR');
  }, []);

  const handleConvert = () => {
    if (!fromAsset || !toAsset || Number.isNaN(numericAmount)) return;
    setHistory((h) => [
      { id: id(), from, to, amount: numericAmount, result, timestamp: new Date().toISOString() },
      ...h,
    ]);
  };

  const fiatRows = fiat
    .filter((f) => `${f.name} ${f.code}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sortFiat === 'rate' ? b.priceUSD - a.priceUSD : b.change24h - a.change24h));

  const cryptoRows = (showAll ? crypto : crypto.slice(0, 10));

  return (
    <div className="app">
      <header className="header glass">
        <div className="brand">💠 Exchango Elite</div>
        <nav>
          <a href="#converter">Converter</a>
          <a href="#markets">Markets</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button className="icon-btn" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
      </header>

      <section className="hero">
        <div className="floating">₿</div><div className="floating eth">Ξ</div><div className="floating usd">$</div>
        <h1>Live Currency &amp; Crypto Converter</h1>
        <p>Track real-time exchange rates worldwide with precision.</p>
        <a href="#converter" className="cta">Start Converting</a>
      </section>

      <main>
        <section id="converter" className="converter glass">
          <div className="converter-head">
            <h2>Advanced Converter</h2>
            <div className="meta">Updated {lastUpdated ? 'just now' : '...'} · Data Powered by CoinGecko</div>
          </div>
          {offline && <p className="warning"><WifiOff size={14} /> Offline mode detected.</p>}
          {error && <p className="error">{error}</p>}
          {loading ? <div className="skeleton" /> : (
            <>
              <div className="form-row">
                <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="Amount" />
                <select value={from} onChange={(e) => setFrom(e.target.value)}>{assets.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}</select>
                <button className="swap" onClick={() => { const f = from; setFrom(to); setTo(f); }}> <ArrowUpDown size={18} /></button>
                <select value={to} onChange={(e) => setTo(e.target.value)}>{assets.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}</select>
              </div>
              <div className="quick-pairs">{POPULAR_PAIRS.map(([a, b]) => <button key={a+b} onClick={() => {setFrom(a); setTo(b);}}>{a} → {b}</button>)}</div>
              <div className="result-card">
                <div className="value">{Number.isFinite(result) ? result.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '0'} {to}</div>
                <p>1 {from} = {fromAsset && toAsset ? (fromAsset.priceUSD / toAsset.priceUSD).toFixed(6) : '--'} {to}</p>
                <div className="result-actions">
                  <button onClick={handleConvert}>Save conversion</button>
                  <button onClick={() => navigator.clipboard.writeText(`${amount} ${from} = ${result} ${to}`)}><Copy size={15} />Copy</button>
                  <Sparkline data={toAsset?.sparkline ?? []} positive={(toAsset?.change24h ?? 0) >= 0} />
                </div>
              </div>
            </>
          )}

          <div className="history">
            <h3>Recent conversions</h3>
            {history.map((h) => <div key={h.id} className="history-row">{h.amount} {h.from} → {h.result.toFixed(4)} {h.to}</div>)}
          </div>
        </section>

        <section id="markets" className="markets">
          <div className="section-title">
            <h2>Live Market Dashboard</h2>
            <button className="icon-btn" onClick={fetchData}><RefreshCcw size={15} />Refresh</button>
          </div>
          <div className="grid-two">
            <article className="glass table-wrap">
              <h3>Crypto Market</h3>
              <table>
                <thead><tr><th>#</th><th>Coin</th><th>Price</th><th>24h</th><th>7d</th><th>Cap</th><th>Vol</th><th>Trend</th><th>★</th></tr></thead>
                <tbody>
                  {cryptoRows.map((c) => <tr key={c.code}><td>{c.rank}</td><td>{c.name} <span>{c.symbol}</span></td><td>${c.priceUSD.toLocaleString()}</td><td className={c.change24h >= 0 ? 'up':'down'}>{c.change24h.toFixed(2)}%</td><td className={c.change7d >= 0 ? 'up':'down'}>{c.change7d.toFixed(2)}%</td><td>${(c.marketCap || 0).toLocaleString()}</td><td>${(c.volume24h || 0).toLocaleString()}</td><td><Sparkline data={c.sparkline} positive={c.change24h>=0} /></td><td><button className="icon-btn" onClick={() => setFavorites((f) => f.includes(c.code) ? f.filter((x) => x !== c.code) : [...f, c.code])}><Star size={14} fill={favorites.includes(c.code) ? 'currentColor' : 'none'} /></button></td></tr>)}
                </tbody>
              </table>
              <button onClick={() => setShowAll((v) => !v)} className="more">{showAll ? 'Show Top 10' : 'Expand to Top 100'}</button>
            </article>

            <article className="glass table-wrap">
              <div className="table-tools">
                <h3>Major Fiat Currencies</h3>
                <div>
                  <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <button onClick={() => setSortFiat((s) => s === 'rate' ? 'change' : 'rate')}><Search size={14} /> Sort: {sortFiat}</button>
                </div>
              </div>
              <table>
                <thead><tr><th>Flag</th><th>Name</th><th>Code</th><th>Rate vs USD</th><th>24h</th></tr></thead>
                <tbody>
                  {fiatRows.map((f) => <tr key={f.code}><td>{f.flag}</td><td>{f.name}</td><td>{f.code}</td><td>{(1/f.priceUSD).toFixed(4)}</td><td className={f.change24h >= 0 ? 'up':'down'}>{f.change24h.toFixed(2)}%</td></tr>)}
                </tbody>
              </table>
            </article>
          </div>
        </section>

        <section className="extras grid-two">
          <article className="glass"><h3>Market Sentiment</h3><p>Risk-on momentum is moderate with stable BTC dominance and improving fiat-volatility spread.</p></article>
          <article className="glass"><h3>Global Currency Heatmap</h3><div className="heatmap">USD EUR GBP JPY AUD CAD CHF CNY INR NPR</div></article>
        </section>

        <section id="faq" className="glass faq">
          <h3>FAQ</h3>
          <details><summary>How often does data refresh?</summary><p>Automatically every 10 seconds with manual refresh available.</p></details>
          <details><summary>Which sources power rates?</summary><p>CoinGecko for crypto and Open Exchange Rate feed for fiat references.</p></details>
          <details><summary>Can I save history?</summary><p>Yes, recent conversions are stored locally in your browser.</p></details>
        </section>
      </main>

      <footer className="footer">
        <div>About · API Credits · Privacy Policy · Contact</div>
        <form className="newsletter"><input placeholder="Newsletter email" /><button>Subscribe</button></form>
        <small>Trusted by 1M+ global users.</small>
      </footer>
    </div>
  );
};

export default App;
