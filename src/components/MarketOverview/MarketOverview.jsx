import { Card } from '../Card/Card';
import { StatCard } from '../StatCard/StatCard';
import { RangeIndicator } from '../RangeIndicator/RangeIndicator';
import { useReveal } from '../../hooks/useReveal';
import { formatUsd, formatCompact } from '../../utils/format';
import './MarketOverview.css';

export function MarketOverview({ coin }) {
  const ref = useReveal({ stagger: true });

  return (
    <section className="section">
      <h2 className="section-title">Market Overview</h2>
      <div className="market-overview-grid" ref={ref}>
        <StatCard label="Market Cap" value={coin.marketCap} format={(v) => '$' + formatCompact(v)} trend={coin.marketCapChange24h} />
        <StatCard label="24h Volume" value={coin.volume24h} format={(v) => '$' + formatCompact(v)} trend={coin.volumeChange24h} />
        <StatCard label="Fully Diluted Valuation" value={coin.fdv} format={(v) => '$' + formatCompact(v)} />
        <StatCard label="Market Cap Rank" value={`#${coin.rank}`} />
      </div>

      <Card className="range-card">
        <h3 className="range-card-title">24-Hour Range</h3>
        <RangeIndicator low={coin.low24h} current={coin.price} high={coin.high24h} />
      </Card>
    </section>
  );
}
