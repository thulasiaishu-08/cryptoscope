import { Card } from '../Card/Card';
import { AnimatedNumber } from '../AnimatedNumber/AnimatedNumber';
import { useReveal } from '../../hooks/useReveal';
import { formatSupply } from '../../utils/format';
import './TokenSupply.css';

export function TokenSupply({ coin }) {
  const ref = useReveal();
  const hasMax = coin.maxSupply != null;
  const pct = hasMax ? Math.min(100, (coin.circulatingSupply / coin.maxSupply) * 100) : 100;

  return (
    <section className="section">
      <h2 className="section-title">Token Supply</h2>
      <Card className="supply-card" ref={ref}>
        <div className="supply-headline">
          <AnimatedNumber
            value={coin.circulatingSupply}
            format={(v) => formatSupply(v, coin.symbol)}
            as="div"
            className="supply-headline-value mono"
          />
          <span className="supply-headline-label">Circulating Supply</span>
        </div>

        <div className="supply-progress-wrap">
          <div className="supply-progress-track">
            {hasMax ? (
              <div className="supply-progress-fill" style={{ width: `${pct}%` }} />
            ) : (
              <div className="supply-progress-fill supply-progress-fill-uncapped" />
            )}
          </div>
          <span className="supply-progress-pct mono">{hasMax ? `${pct.toFixed(1)}%` : 'Uncapped'}</span>
        </div>

        <div className="supply-stats-grid">
          <div className="supply-stat">
            <span className="supply-stat-label">Circulating Supply</span>
            <span className="supply-stat-value mono">{formatSupply(coin.circulatingSupply, coin.symbol)}</span>
          </div>
          <div className="supply-stat">
            <span className="supply-stat-label">Total Supply</span>
            <span className="supply-stat-value mono">{formatSupply(coin.totalSupply, coin.symbol)}</span>
          </div>
          <div className="supply-stat">
            <span className="supply-stat-label">Max Supply</span>
            <span className="supply-stat-value mono">{hasMax ? formatSupply(coin.maxSupply, coin.symbol) : '∞'}</span>
          </div>
          <div className="supply-stat">
            <span className="supply-stat-label">Supply Percentage</span>
            <span className="supply-stat-value mono">{hasMax ? `${pct.toFixed(1)}%` : '—'}</span>
          </div>
        </div>
      </Card>
    </section>
  );
}
