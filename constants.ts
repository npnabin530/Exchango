import { Currency } from './types';

export const API_ENDPOINTS = {
  FIAT: 'https://open.er-api.com/v6/latest/USD',
  // CoinGecko Markets endpoint provides rich data (images, changes) compared to simple/price
  CRYPTO: 'https://api.coincap.io/v2/assets?limit=50', // Fallback to Coincap if Gecko fails
  CRYPTO_GECKO: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false',
};

// Helper to get country code for flags
export const getCountryCode = (currencyCode: string): string => {
  const overrides: Record<string, string> = {
    USD: 'us', EUR: 'eu', GBP: 'gb', JPY: 'jp', AUD: 'au',
    CAD: 'ca', CHF: 'ch', CNY: 'cn', SEK: 'se', NZD: 'nz',
    MXN: 'mx', SGD: 'sg', HKD: 'hk', NOK: 'no', KRW: 'kr',
    TRY: 'tr', INR: 'in', RUB: 'ru', BRL: 'br', ZAR: 'za',
    DKK: 'dk', PLN: 'pl', TWD: 'tw', THB: 'th', MYR: 'my',
    NPR: 'np', IDR: 'id',
  };
  return overrides[currencyCode] || currencyCode.slice(0, 2).toLowerCase();
};

// Initial fallback data
export const MAJOR_FIAT_CURRENCIES = [
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'NPR', name: 'Nepalese Rupee' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'CHF', name: 'Swiss Franc' },
];

export const FALLBACK_CRYPTO_DATA: Currency[] = [
  { code: 'BTC', name: 'Bitcoin', type: 'crypto', rateInUSD: 64230.50, change24h: 1.2, marketCap: 1200000000000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  { code: 'ETH', name: 'Ethereum', type: 'crypto', rateInUSD: 3450.20, change24h: -0.5, marketCap: 400000000000, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  { code: 'BNB', name: 'BNB', type: 'crypto', rateInUSD: 590.10, change24h: 0.8, marketCap: 87000000000, image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  { code: 'SOL', name: 'Solana', type: 'crypto', rateInUSD: 145.20, change24h: 5.4, marketCap: 65000000000, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  { code: 'USDT', name: 'Tether', type: 'crypto', rateInUSD: 1.00, change24h: 0.01, marketCap: 110000000000, image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
  { code: 'DOGE', name: 'Dogecoin', type: 'crypto', rateInUSD: 0.16, change24h: 2.1, marketCap: 23000000000, image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
];

export const REFRESH_INTERVAL = 10000; // 10 seconds auto-refresh