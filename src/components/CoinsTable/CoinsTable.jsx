import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../Card/Card';
import { CoinIcon } from '../CoinIcon/CoinIcon';
import { formatUsd, formatPercent, formatCompact } from '../../utils/format';
import './CoinsTable.css';

export function CoinsTable({ coins, onSelect }) {
  return (
    <Card className="coins-table-card">
      <table className="coins-table">
        <thead>
          <tr>
            <th className="coins-table-rank-col">Rank</th>
            <th>Coin</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>Market Cap</th>
            <th>24h Volume</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const isPositive = coin.change24h >= 0;
            return (
              <tr
                key={coin.id}
                onClick={() => onSelect(coin)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(coin);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`View ${coin.name} research`}
              >
                <td className="coins-table-rank-col mono">{coin.rank}</td>
                <td>
                  <div className="coins-table-identity">
                    <CoinIcon coin={coin} size={28} />
                    <div>
                      <div className="coins-table-name">{coin.name}</div>
                      <div className="coins-table-symbol">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="mono">{formatUsd(coin.price)}</td>
                <td>
                  <span className={`coins-table-change ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                    {formatPercent(coin.change24h)}
                  </span>
                </td>
                <td className="mono">${formatCompact(coin.marketCap)}</td>
                <td className="mono">${formatCompact(coin.volume24h)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="coins-cards">
        {coins.map((coin) => {
          const isPositive = coin.change24h >= 0;
          return (
            <button key={coin.id} className="coins-card" onClick={() => onSelect(coin)}>
              <div className="coins-card-top">
                <div className="coins-table-identity">
                  <CoinIcon coin={coin} size={30} />
                  <div>
                    <div className="coins-table-name">{coin.name}</div>
                    <div className="coins-table-symbol">{coin.symbol}</div>
                  </div>
                </div>
                <span className="coins-card-rank mono">#{coin.rank}</span>
              </div>
              <div className="coins-card-bottom">
                <span className="mono">{formatUsd(coin.price)}</span>
                <span className={`coins-table-change ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                  {formatPercent(coin.change24h)}
                </span>
              </div>
              <div className="coins-card-stats">
                <span>Market Cap · ${formatCompact(coin.marketCap)}</span>
                <span>Vol · ${formatCompact(coin.volume24h)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {coins.length === 0 && <div className="coins-table-empty">No coins match your search.</div>}
    </Card>
  );
}
