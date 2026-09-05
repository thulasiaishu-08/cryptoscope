import { formatUsd, formatCompact } from '../../utils/format';

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-time">{label}</div>
      {d.open != null && (
        <div className="chart-tooltip-ohlc">
          <span>O <b className="mono">{formatUsd(d.open)}</b></span>
          <span>H <b className="mono">{formatUsd(d.high)}</b></span>
          <span>L <b className="mono">{formatUsd(d.low)}</b></span>
          <span>C <b className="mono">{formatUsd(d.close)}</b></span>
        </div>
      )}
      {d.open == null && (
        <div className="chart-tooltip-price mono">{formatUsd(d.price)}</div>
      )}
      {d.volume != null && (
        <div className="chart-tooltip-volume">Vol <b className="mono">${formatCompact(d.volume)}</b></div>
      )}
    </div>
  );
}
