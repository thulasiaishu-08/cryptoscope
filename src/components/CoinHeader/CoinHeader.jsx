import { useRef } from 'react';
import gsap from 'gsap';
import { ChevronRight, Plus, Check, GitCompareArrows, ArrowUp, ArrowDown } from 'lucide-react';
import { CoinIcon } from '../CoinIcon/CoinIcon';
import { AnimatedNumber } from '../AnimatedNumber/AnimatedNumber';
import { useApp } from '../../context/AppContext';
import { formatUsd, formatPercent } from '../../utils/format';
import { ANIMATIONS_ENABLED } from '../../utils/animationConfig';
import './CoinHeader.css';

export function CoinHeader({ coin }) {
  const { isWatched, toggleWatchlist, setCompareOpen } = useApp();
  const watched = isWatched(coin.symbol);
  const starRef = useRef(null);
  const isPositive = coin.change24h >= 0;

  function handleWatchClick() {
    toggleWatchlist(coin.symbol);
    if (ANIMATIONS_ENABLED && !watched && starRef.current) {
      gsap.fromTo(starRef.current, { scale: 0.6, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(3)' });
    }
  }

  return (
    <div className="coin-header">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <span>Cryptocurrency</span>
        <ChevronRight size={13} />
        <span className="breadcrumb-current">{coin.name}</span>
      </nav>

      <div className="coin-header-row">
        <div className="coin-header-identity">
          <CoinIcon coin={coin} size={44} />
          <div>
            <div className="coin-header-title">
              <h1>{coin.name}</h1>
              <span className="coin-symbol-badge">{coin.symbol}</span>
              <span className="coin-rank-badge">Rank #{coin.rank}</span>
            </div>
            <div className="coin-header-price-mobile mobile-only">
              <span className="mono">{formatUsd(coin.price)}</span>
              <span className={isPositive ? 'positive' : 'negative'}>{formatPercent(coin.change24h)}</span>
            </div>
          </div>
        </div>

        <div className="coin-header-actions">
          <button className={`watch-btn ${watched ? 'watch-btn-active' : ''}`} onClick={handleWatchClick} aria-pressed={watched}>
            <span ref={starRef} style={{ display: 'flex' }}>
              {watched ? <Check size={15} /> : <Plus size={15} />}
            </span>
            {watched ? 'On Watchlist' : 'Add to Watchlist'}
          </button>
          <button className="compare-btn" onClick={() => setCompareOpen(true)}>
            <GitCompareArrows size={15} />
            Compare
          </button>
        </div>
      </div>

      <div className="coin-header-price-row desktop-only">
        <AnimatedNumber value={coin.price} format={(v) => formatUsd(v)} as="div" className="coin-price mono" />
        <div className={`coin-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
          {formatPercent(coin.change24h)}
          <span className="coin-change-label">24h</span>
        </div>
      </div>

      <div className="coin-header-lowhigh">
        <div className="lowhigh-item">
          <span className="lowhigh-label">24H Low</span>
          <span className="lowhigh-value mono">{formatUsd(coin.low24h)}</span>
        </div>
        <div className="lowhigh-divider" />
        <div className="lowhigh-item">
          <span className="lowhigh-label">24H High</span>
          <span className="lowhigh-value mono">{formatUsd(coin.high24h)}</span>
        </div>
      </div>
    </div>
  );
}
