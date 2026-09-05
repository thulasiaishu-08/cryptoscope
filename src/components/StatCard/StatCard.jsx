import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../Card/Card';
import { AnimatedNumber } from '../AnimatedNumber/AnimatedNumber';
import { formatPercent } from '../../utils/format';
import './StatCard.css';

export function StatCard({ label, value, format, trend, sub }) {
  const hasTrend = trend != null;
  const isPositive = hasTrend && trend >= 0;

  return (
    <Card className="stat-card" hoverable>
      <span className="stat-card-label">{label}</span>
      {typeof value === 'number' && format ? (
        <AnimatedNumber value={value} format={format} as="div" className="stat-card-value mono" />
      ) : (
        <div className="stat-card-value mono">{value}</div>
      )}
      {hasTrend && (
        <div className={`stat-card-trend ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {formatPercent(trend)}
        </div>
      )}
      {sub && <div className="stat-card-sub">{sub}</div>}
    </Card>
  );
}
