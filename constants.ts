import { Currency } from './types';

export const API_ENDPOINTS = {
  FIAT: 'https://open.er-api.com/v6/latest/USD',
  // Binance Public API for real-time tickers
  BINANCE_TICKER: 'https://api.binance.com/api/v3/ticker/24hr',
  // CoinGecko Markets endpoint provides rich data (images, changes) compared to simple/price
  CRYPTO_GECKO: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false',
};

// Target symbols to fetch from Binance (Top assets)
export const CRYPTO_SYMBOLS = [
  'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'TRX', 'DOT'
];

// Helper to map Symbol to Name and Image (Binance doesn't provide these)
export const CRYPTO_METADATA: Record<string, { name: string; image: string }> = {
  BTC: { name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  ETH: { name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  BNB: { name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  SOL: { name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  XRP: { name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
  DOGE: { name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
  ADA: { name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
  AVAX: { name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png' },
  TRX: { name: 'TRON', image: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png' },
  DOT: { name: 'Polkadot', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png' },
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
  { code: 'BTC', name: 'Bitcoin', type: 'crypto', rateInUSD: 64230.50, change24h: 1.2, volume24h: 35000000000, high24h: 65000, low24h: 63000, image: CRYPTO_METADATA.BTC.image },
  { code: 'ETH', name: 'Ethereum', type: 'crypto', rateInUSD: 3450.20, change24h: -0.5, volume24h: 15000000000, high24h: 3500, low24h: 3400, image: CRYPTO_METADATA.ETH.image },
  { code: 'BNB', name: 'BNB', type: 'crypto', rateInUSD: 590.10, change24h: 0.8, volume24h: 1200000000, high24h: 600, low24h: 580, image: CRYPTO_METADATA.BNB.image },
  { code: 'SOL', name: 'Solana', type: 'crypto', rateInUSD: 145.20, change24h: 5.4, volume24h: 4000000000, high24h: 150, low24h: 140, image: CRYPTO_METADATA.SOL.image },
  { code: 'XRP', name: 'XRP', type: 'crypto', rateInUSD: 0.60, change24h: 0.01, volume24h: 800000000, high24h: 0.62, low24h: 0.59, image: CRYPTO_METADATA.XRP.image },
  { code: 'DOGE', name: 'Dogecoin', type: 'crypto', rateInUSD: 0.16, change24h: 2.1, volume24h: 900000000, high24h: 0.17, low24h: 0.15, image: CRYPTO_METADATA.DOGE.image },
];

export const REFRESH_INTERVAL = 10000; // 10 seconds auto-refresh