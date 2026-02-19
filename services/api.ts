import { API_ENDPOINTS, FALLBACK_CRYPTO_DATA, getCountryCode } from '../constants';
import { Currency, CoinGeckoAsset, FiatApiResponse } from '../types';

/**
 * Robust fetcher with exponential backoff retry logic.
 */
async function fetchWithRetry<T>(url: string, retries = 3, delay = 2000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      return await response.json() as T;
    } catch (err) {
      const isLastAttempt = i === retries - 1;
      if (isLastAttempt) throw err;
      
      console.warn(`Attempt ${i + 1} failed for ${url}. Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

export const fetchFiatRates = async (): Promise<Currency[]> => {
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

    return currencies;
  } catch (error) {
    console.error('Error fetching fiat rates:', error);
    // Return minimal fallback
    return [{ code: 'USD', name: 'USD', type: 'fiat', rateInUSD: 1, image: 'https://flagcdn.com/w80/us.png' }];
  }
};

export const fetchCryptoRates = async (): Promise<Currency[]> => {
  try {
    // Try CoinGecko first
    const data = await fetchWithRetry<CoinGeckoAsset[]>(API_ENDPOINTS.CRYPTO_GECKO);
    
    return data.map((coin) => ({
      code: coin.symbol.toUpperCase(),
      name: coin.name,
      type: 'crypto',
      rateInUSD: coin.current_price,
      image: coin.image,
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
    }));

  } catch (error) {
    console.warn('CoinGecko API limit reached or offline. Using fallback.', error);
    return FALLBACK_CRYPTO_DATA;
  }
};