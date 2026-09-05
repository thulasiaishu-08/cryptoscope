// Mock service layer. Every export returns a Promise on a short artificial
// delay so components already handle async/loading states — swapping these
// bodies for `fetch('/api/...')` calls is the only change a real backend needs.
import { COINS, getCoinBySymbol, getCoinById } from '../data/mockCoins';
import { getChartData } from '../data/chartData';

const DELAY_MS = 220;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

export function getCoins() {
  return delay(COINS);
}

export function getCoinBySymbolAsync(symbol) {
  return delay(getCoinBySymbol(symbol) ?? null);
}

export function getCoinByIdAsync(id) {
  return delay(getCoinById(id) ?? null);
}

export function getMarketData(symbol) {
  const coin = getCoinBySymbol(symbol);
  if (!coin) return delay(null);
  return delay({
    marketCap: coin.marketCap,
    marketCapChange24h: coin.marketCapChange24h,
    volume24h: coin.volume24h,
    volumeChange24h: coin.volumeChange24h,
    fdv: coin.fdv,
    rank: coin.rank,
    low24h: coin.low24h,
    high24h: coin.high24h,
    price: coin.price,
  });
}

export function getChartDataAsync(symbol, timeframe) {
  const coin = getCoinBySymbol(symbol);
  if (!coin) return delay([]);
  return delay(getChartData(symbol, timeframe, coin.price));
}

const EXCHANGES = [
  { exchange: 'Binance', pairSuffix: 'USDT', priceMul: 1.0, volume: 8200000000, liquidity: 'High' },
  { exchange: 'Coinbase', pairSuffix: 'USD', priceMul: 1.0003, volume: 2100000000, liquidity: 'High' },
  { exchange: 'Kraken', pairSuffix: 'USD', priceMul: 0.9998, volume: 1400000000, liquidity: 'Medium' },
  { exchange: 'OKX', pairSuffix: 'USDT', priceMul: 1.0002, volume: 1850000000, liquidity: 'High' },
  { exchange: 'Bybit', pairSuffix: 'USDT', priceMul: 0.9995, volume: 980000000, liquidity: 'Medium' },
  { exchange: 'Bitstamp', pairSuffix: 'USD', priceMul: 1.0006, volume: 340000000, liquidity: 'Low' },
];

export function getMarketsTable(symbol) {
  const coin = getCoinBySymbol(symbol);
  if (!coin) return delay([]);
  const rows = EXCHANGES.map((ex) => ({
    exchange: ex.exchange,
    pair: `${coin.symbol}/${ex.pairSuffix}`,
    price: Number((coin.price * ex.priceMul).toFixed(coin.price < 10 ? 4 : 2)),
    change24h: Number((coin.change24h + (ex.priceMul - 1) * 40).toFixed(2)),
    volume: ex.volume * (coin.price / 67842.31 > 0.05 ? 1 : 0.02),
    liquidity: ex.liquidity,
  }));
  return delay(rows);
}
