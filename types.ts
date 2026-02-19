export interface Currency {
  code: string;
  name: string;
  type: 'fiat' | 'crypto';
  rateInUSD: number; // The value of 1 unit of this currency in USD
  image?: string;
  change24h?: number;
  marketCap?: number;
}

export interface ConversionState {
  amount: number;
  from: string;
  to: string;
  result: number;
  rate: number;
}

// CoinGecko structure
export interface CoinGeckoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface FiatApiResponse {
  rates: Record<string, number>;
  time_last_update_utc: string;
}