import { API_ENDPOINTS, FALLBACK_CRYPTO_DATA, getCountryCode } from '../constants';
import { Currency, CoinGeckoAsset, FiatApiResponse } from '../types';

export interface FetchResult {
  data: Currency[];
  isFallback: boolean;
  error?: string;
}

/**
 * Robust fetcher with exponential backoff retry logic.
 */
async function fetchWithRetry<T>(url: string, retries = 3, delay = 2000): Promise<T> {
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
      
      // Increase delay for rate limits
      const nextDelay = delay * (i + 1);
      // Using info instead of warn to keep console cleaner for expected retries
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
    // Return minimal fallback
    return { 
      data: [{ code: 'USD', name: 'USD', type: 'fiat', rateInUSD: 1, image: 'https://flagcdn.com/w80/us.png' }], 
      isFallback: true,
      error: 'Fiat API Unavailable'
    };
  }
};

export const fetchCryptoRates = async (): Promise<FetchResult> => {
  try {
    // Try CoinGecko first (Rich Data)
    const data = await fetchWithRetry<CoinGeckoAsset[]>(API_ENDPOINTS.CRYPTO_GECKO);
    
    const currencies: Currency[] = data.map((coin) => ({
      code: coin.symbol.toUpperCase(),
      name: coin.name,
      type: 'crypto',
      rateInUSD: coin.current_price,
      image: coin.image,
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
    }));

    return { data: currencies, isFallback: false };

  } catch (error) {
    console.info('CoinGecko API rate limited or offline. Switching to cached fallback data.');
    return { 
      data: FALLBACK_CRYPTO_DATA, 
      isFallback: true,
      error: 'Crypto API Rate Limited'
    };
  }
};