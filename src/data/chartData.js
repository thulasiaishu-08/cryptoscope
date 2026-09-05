// Deterministic mock OHLCV generator — seeded so the same coin/timeframe
// always renders the same "realistic" series instead of jumping around.
const TIMEFRAME_CONFIG = {
  '1H': { points: 60, stepMs: 60 * 1000, volatility: 0.0006, label: (t) => `${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}` },
  '4H': { points: 48, stepMs: 5 * 60 * 1000, volatility: 0.0009, label: (t) => `${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}` },
  '1D': { points: 96, stepMs: 15 * 60 * 1000, volatility: 0.0014, label: (t) => `${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}` },
  '1W': { points: 84, stepMs: 2 * 60 * 60 * 1000, volatility: 0.0022, label: (t) => t.toLocaleDateString(undefined, { weekday: 'short' }) },
  '1M': { points: 90, stepMs: 8 * 60 * 60 * 1000, volatility: 0.003, label: (t) => t.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) },
  '1Y': { points: 104, stepMs: 3.5 * 24 * 60 * 60 * 1000, volatility: 0.006, label: (t) => t.toLocaleDateString(undefined, { month: 'short' }) },
  ALL: { points: 120, stepMs: 12 * 24 * 60 * 60 * 1000, volatility: 0.009, label: (t) => t.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }) },
};

export const TIMEFRAMES = Object.keys(TIMEFRAME_CONFIG);

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function seedFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

export function getChartData(symbol, timeframe, basePrice) {
  const config = TIMEFRAME_CONFIG[timeframe] || TIMEFRAME_CONFIG['1D'];
  const rand = seededRandom(seedFromString(`${symbol}-${timeframe}`));
  const now = Date.now();
  const raw = [];

  let price = basePrice * (1 - config.volatility * config.points * 0.28);

  for (let i = 0; i < config.points; i++) {
    const t = new Date(now - (config.points - i) * config.stepMs);
    const drift = (rand() - 0.47) * config.volatility * basePrice;
    const open = price;
    price = Math.max(price + drift, basePrice * 0.4);
    const close = price;
    const wick = Math.abs(close - open) * (0.4 + rand() * 1.1) + basePrice * config.volatility * 0.15;
    const high = Math.max(open, close) + wick * rand();
    const low = Math.min(open, close) - wick * rand();
    const volume = basePrice * (800 + rand() * 2600) * (0.6 + config.volatility * 40);

    raw.push({ t, open, close, high, low, volume });
  }

  // The random walk rarely ends exactly on the coin's current live price.
  // Rather than snapping only the last candle there (which reads as a fake
  // spike), spread the correction across the whole series as a linear ramp
  // so it lands on basePrice smoothly.
  const correction = basePrice - raw[raw.length - 1].close;

  return raw.map((p, i) => {
    const adj = correction * (i / (raw.length - 1));
    const open = p.open + adj;
    const close = p.close + adj;
    const high = p.high + adj;
    const low = p.low + adj;
    return {
      time: config.label(p.t),
      timestamp: p.t.getTime(),
      open: Number(open.toFixed(2)),
      close: Number(close.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      price: Number(close.toFixed(2)),
      volume: Math.round(p.volume),
    };
  });
}
