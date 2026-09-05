export function formatUsd(value, opts = {}) {
  if (value == null) return '—';
  const { compact = false, decimals } = opts;
  if (compact) {
    return '$' + formatCompact(value);
  }
  const d = decimals ?? (value < 10 ? 4 : 2);
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function formatCompact(value) {
  if (value == null) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e12) return (value / 1e12).toFixed(2) + 'T';
  if (abs >= 1e9) return (value / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return (value / 1e3).toFixed(2) + 'K';
  return value.toFixed(2);
}

export function formatSupply(value, symbol) {
  if (value == null) return '—';
  return `${formatCompact(value)} ${symbol}`;
}

export function formatPercent(value, opts = {}) {
  if (value == null) return '—';
  const { showSign = true } = opts;
  const sign = value > 0 && showSign ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value) {
  if (value == null) return '—';
  return value.toLocaleString('en-US');
}
