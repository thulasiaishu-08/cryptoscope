import { CoinIcon } from '../CoinIcon/CoinIcon';
import { formatUsd } from '../../utils/format';
import './CoinSelector.css';

// A single comparison slot: shows the chosen coin, or a picker of the
// remaining coins if empty / clicked to change.
export function CoinSelector({ coin, coins, excludeSymbols, onSelect, onClear, label }) {
  const available = coins.filter((c) => !excludeSymbols.includes(c.symbol) || c.symbol === coin?.symbol);

  if (coin) {
    return (
      <div className="coin-selector coin-selector-filled">
        <CoinIcon coin={coin} size={30} />
        <div className="coin-selector-info">
          <span className="coin-selector-name">{coin.name}</span>
          <span className="coin-selector-price mono">{formatUsd(coin.price)}</span>
        </div>
        {onClear && (
          <button className="coin-selector-clear" onClick={onClear} aria-label={`Remove ${coin.name} from comparison`}>
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="coin-selector coin-selector-empty">
      <span className="coin-selector-placeholder">{label}</span>
      <select
        aria-label={label}
        value=""
        onChange={(e) => e.target.value && onSelect(e.target.value)}
      >
        <option value="" disabled>
          Select a coin
        </option>
        {available.map((c) => (
          <option key={c.symbol} value={c.symbol}>
            {c.name} ({c.symbol})
          </option>
        ))}
      </select>
    </div>
  );
}
