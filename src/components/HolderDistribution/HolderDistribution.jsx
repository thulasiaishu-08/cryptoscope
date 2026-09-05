import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../Card/Card';
import { AnimatedNumber } from '../AnimatedNumber/AnimatedNumber';
import { useReveal } from '../../hooks/useReveal';
import { formatCompact } from '../../utils/format';
import { ANIMATIONS_ENABLED } from '../../utils/animationConfig';
import './HolderDistribution.css';

const COLORS = ['#7c93ff', '#35e0a6', '#3a3a42'];

export function HolderDistribution({ coin }) {
  const ref = useReveal({ stagger: true });

  const data = [
    { name: 'Top 10 Holders', value: coin.top10Holders },
    { name: 'Top 100 Holders', value: coin.top100Holders - coin.top10Holders },
    { name: 'Others', value: 100 - coin.top100Holders },
  ];
  const legendData = [
    { name: 'Top 10 Holders', value: coin.top10Holders },
    { name: 'Top 100 Holders', value: coin.top100Holders },
    { name: 'Others', value: Number((100 - coin.top100Holders).toFixed(1)) },
  ];

  return (
    <section className="section">
      <h2 className="section-title">Holder Distribution</h2>
      <div className="holder-grid" ref={ref}>
        <Card className="holder-chart-card">
          <div className="holder-total">
            <AnimatedNumber value={coin.totalHolders} format={(v) => formatCompact(v)} as="div" className="holder-total-value mono" />
            <span className="holder-total-label">Total Holders</span>
          </div>

          <div className="holder-donut-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive={ANIMATIONS_ENABLED}
                >
                  {data.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i]} stroke="var(--surface)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="chart-tooltip">
                        {payload[0].name}: <b>{payload[0].value.toFixed(1)}%</b>
                      </div>
                    ) : null
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="holder-legend">
            {legendData.map((item, i) => (
              <div key={item.name} className="holder-legend-item">
                <span className="holder-legend-dot" style={{ background: COLORS[i] }} />
                <span className="holder-legend-name">{item.name}</span>
                <span className="holder-legend-value mono">{item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="holder-info-cards">
          <Card className="holder-info-card">
            <span className="holder-info-label">Whale Activity</span>
            <span className={`holder-info-value ${coin.whaleActivity === 'High' ? 'negative' : coin.whaleActivity === 'Low' ? 'positive' : ''}`}>
              {coin.whaleActivity}
            </span>
          </Card>
          <Card className="holder-info-card">
            <span className="holder-info-label">Holder Growth</span>
            <span className="holder-info-value positive">+{coin.holderGrowth.toFixed(1)}%</span>
          </Card>
        </div>
      </div>
    </section>
  );
}
