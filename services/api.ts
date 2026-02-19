import { API_ENDPOINTS, FALLBACK_CRYPTO_DATA, getCountryCode, CRYPTO_SYMBOLS, CRYPTO_METADATA } from '../constants';
import { Currency, CoinGeckoAsset, FiatApiResponse, BinanceTicker } from '../types';

export interface FetchResult {
  data: Currency[];
  isFallback: boolean;
  error?: string;
}

/**
 * Robust fetcher with exponential backoff retry logic.
 */
async function fetchWithRetry<T>(url: string, retries = 2, delay = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      return await response.json() as T;
    } catch (err) {
      const isLastAttempt = i === retries - 1;
      if (isLastAttempt) throw err;
      
      const nextDelay = delay * (i + 1);
      console.info(`Attempt ${i + 1} failed for ${url}. Retrying in ${nextDelay}ms...`);
      await new Promise(r => setTimeout(r, nextDelay));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

export const fetchFiatRates = async (): Promise<FetchResult> => {
  try {
    const data = await fetchWithRetry<FiatApiResponse>(API_ENDPOINTS.FIAT);
    
    // Transform the rates object into our Currency array format
    const currencies: Currency[] = Object.entries(data.rates).map(([code, rate]) => {
      const countryCode = getCountryCode(code);
      return {
        code,
        name: code, 
        type: 'fiat',
        rateInUSD: 1 / rate,
        image: `https://flagcdn.com/w80/${countryCode}.png` // High quality flags
      };
    });

    return { data: currencies, isFallback: false };
  } catch (error) {
    console.info('Fiat API unavailable, switching to fallback.');
    return { 
      data: [{ code: 'USD', name: 'USD', type: 'fiat', rateInUSD: 1, image: 'https://flagcdn.com/w80/us.png' }], 
      isFallback: true,
      error: 'Fiat API Unavailable'
    };
  }
};

const fetchBinanceRates = async (): Promise<Currency[]> => {
  // Fetch all tickers
  const data = await fetchWithRetry<BinanceTicker[]>(API_ENDPOINTS.BINANCE_TICKER);
  
  // Filter for USDT pairs of our interest
  const relevantTickers = data.filter(ticker => {
    // Check if it ends with USDT
    if (!ticker.symbol.endsWith('USDT')) return false;
    // Check if the base symbol is in our list
    const baseSymbol = ticker.symbol.replace('USDT', '');
    return CRYPTO_SYMBOLS.includes(baseSymbol);
  });

  return relevantTickers.map(ticker => {
    const code = ticker.symbol.replace('USDT', '');
    const meta = CRYPTO_METADATA[code] || { name: code, image: '' };
    
    return {
      code,
      name: meta.name,
      type: 'crypto',
      rateInUSD: parseFloat(ticker.lastPrice),
      change24h: parseFloat(ticker.priceChangePercent),
      volume24h: parseFloat(ticker.quoteVolume), // Use quote volume (USDT) for simpler ranking
      high24h: parseFloat(ticker.highPrice),
      low24h: parseFloat(ticker.lowPrice),
      image: meta.image
    };
  });
};

const fetchCoinGeckoRates = async (): Promise<Currency[]> => {
  const data = await fetchWithRetry<CoinGeckoAsset[]>(API_ENDPOINTS.CRYPTO_GECKO);
  
  return data.map((coin) => ({
    code: coin.symbol.toUpperCase(),
    name: coin.name,
    type: 'crypto',
    rateInUSD: coin.current_price,
    image: coin.image,
    change24h: coin.price_change_percentage_24h,
    marketCap: coin.market_cap,
    volume24h: coin.total_volume,
    high24h: coin.high_24h,
    low24h: coin.low_24h
  }));
};

export const fetchCryptoRates = async (): Promise<FetchResult> => {
  try {
    // Priority 1: Binance (Real-time trade data)
    try {
      const binanceData = await fetchBinanceRates();
      // Sort by rank in CRYPTO_SYMBOLS to maintain order
      binanceData.sort((a, b) => CRYPTO_SYMBOLS.indexOf(a.code) - CRYPTO_SYMBOLS.indexOf(b.code));
      return { data: binanceData, isFallback: false };
    } catch (binanceError) {
      console.warn("Binance API failed, trying CoinGecko...", binanceError);
      // Priority 2: CoinGecko (Rich metadata)
      const geckoData = await fetchCoinGeckoRates();
      return { data: geckoData, isFallback: false };
    }
  } catch (error) {
    console.info('All Crypto APIs failed. Switching to cached fallback data.');
    return { 
      data: FALLBACK_CRYPTO_DATA, 
      isFallback: true,
      error: 'Crypto API Rate Limited'
    };
  }
};