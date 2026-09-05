import { Star, ArrowUp, ArrowDown, X } from 'lucide-react';
import { Card } from '../Card/Card';
import { CoinIcon } from '../CoinIcon/CoinIcon';
import { useApp } from '../../context/AppContext';
import { useReveal } from '../../hooks/useReveal';
import { formatUsd, formatPercent, formatCompact } from '../../utils/format';
import './WatchlistView.css';

export function WatchlistView() {
  const { coins, watchlist, toggleWatchlist, selectCoin } = useApp();
  const items = coins.filter((c) => watchlist.includes(c.symbol));
  const ref = useReveal({ stagger: true });

  return (
    <div className="container watchlist-view">
      <h1 className="watchlist-title">Watchlist</h1>
      <p className="watchlist-subtitle">Coins you're tracking, updated with live mock market data.</p>

      {items.length === 0 ? (
        <Card className="watchlist-empty">
          <Star size={28} strokeWidth={1.5} className="watchlist-empty-icon" />
          <h3>No coins saved yet</h3>
          <p>Use the star icon on any coin's research page to add it here.</p>
        </Card>
      ) : (
        <div className="watchlist-grid" ref={ref}>
          {items.map((coin) => {
            const isPositive = coin.change24h >= 0;
            return (
              <Card key={coin.symbol} className="watchlist-card" hoverable>
                <button className="watchlist-remove" onClick={() => toggleWatchlist(coin.symbol)} aria-label={`Remove ${coin.name} from watchlist`}>
                  <X size={14} />
                </button>
                <button className="watchlist-card-main" onClick={() => selectCoin(coin.symbol)}>
                  <div className="watchlist-card-identity">
                    <CoinIcon coin={coin} size={36} />
                    <div>
                      <div className="watchlist-card-name">{coin.name}</div>
                      <div className="watchlist-card-symbol">{coin.symbol}</div>
                    </div>
                  </div>
                  <div className="watchlist-card-price mono">{formatUsd(coin.price)}</div>
                  <div className={`watchlist-card-change ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                    {formatPercent(coin.change24h)}
                  </div>
                  <div className="watchlist-card-cap">Market Cap · ${formatCompact(coin.marketCap)}</div>
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
