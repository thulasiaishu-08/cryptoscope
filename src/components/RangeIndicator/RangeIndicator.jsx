import { formatUsd } from '../../utils/format';
import './RangeIndicator.css';

export function RangeIndicator({ low, current, high }) {
  const pct = Math.min(100, Math.max(0, ((current - low) / (high - low)) * 100));

  return (
    <div className="range-indicator">
      <div className="range-track">
        <div className="range-fill" style={{ width: `${pct}%` }} />
        <div className="range-marker" style={{ left: `${pct}%` }} />
      </div>
      <div className="range-labels">
        <div className="range-label-item">
          <span className="range-label-value mono">{formatUsd(low)}</span>
          <span className="range-label-name">Low</span>
        </div>
        <div className="range-label-item range-label-current">
          <span className="range-label-value mono">{formatUsd(current)}</span>
          <span className="range-label-name">Current</span>
        </div>
        <div className="range-label-item range-label-right">
          <span className="range-label-value mono">{formatUsd(high)}</span>
          <span className="range-label-name">High</span>
        </div>
      </div>
    </div>
  );
}
