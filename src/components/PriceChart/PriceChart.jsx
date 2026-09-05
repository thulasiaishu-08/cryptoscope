import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Cell,
} from 'recharts';
import { X } from 'lucide-react';
import { Card } from '../Card/Card';
import { AnimatedNumber } from '../AnimatedNumber/AnimatedNumber';
import { ChartControls } from './ChartControls';
import { ChartTooltip } from './ChartTooltip';
import { CandleShape } from './CandleShape';
import { getChartDataAsync } from '../../services/api';
import { formatUsd, formatPercent, formatCompact } from '../../utils/format';
import { ANIMATIONS_ENABLED } from '../../utils/animationConfig';
import './PriceChart.css';

function withMovingAverage(data, window = 8) {
  return data.map((d, i) => {
    if (i < window - 1) return { ...d, ma: null };
    const slice = data.slice(i - window + 1, i + 1);
    const avg = slice.reduce((sum, p) => sum + p.close, 0) / window;
    return { ...d, ma: Number(avg.toFixed(2)) };
  });
}

export function PriceChart({ coin }) {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('line');
  const [activeIndicators, setActiveIndicators] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const chartAreaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getChartDataAsync(coin.symbol, timeframe).then((rows) => {
      if (cancelled) return;
      setData(activeIndicators.includes('Moving Average') ? withMovingAverage(rows) : rows);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin.symbol, timeframe]);

  useEffect(() => {
    setData((prev) => (prev.length ? (activeIndicators.includes('Moving Average') ? withMovingAverage(prev) : prev.map(({ ma, ...rest }) => rest)) : prev));
  }, [activeIndicators]);

  useEffect(() => {
    if (ANIMATIONS_ENABLED && !loading && chartAreaRef.current) {
      gsap.fromTo(chartAreaRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }
  }, [loading, timeframe, chartType]);

  function toggleIndicator(name) {
    setActiveIndicators((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }

  const isPositive = coin.change24h >= 0;
  const accentColor = isPositive ? '#35e0a6' : '#fb7373';

  const domain = useMemo(() => {
    if (!data.length) return ['auto', 'auto'];
    const lows = data.map((d) => d.low ?? d.price);
    const highs = data.map((d) => d.high ?? d.price);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const pad = (max - min) * 0.08 || max * 0.01;
    return [min - pad, max + pad];
  }, [data]);

  return (
    <Card className={`price-chart-card ${fullscreen ? 'price-chart-fullscreen' : ''}`}>
      <div className="price-chart-header">
        <div>
          <h2 className="price-chart-title">{coin.name} Price</h2>
          <div className="price-chart-headline">
            <AnimatedNumber value={coin.price} format={(v) => formatUsd(v)} as="span" className="price-chart-headline-value mono" />
            <span className={isPositive ? 'positive' : 'negative'} style={{ fontWeight: 700, fontSize: 14 }}>
              {formatPercent(coin.change24h)}
            </span>
          </div>
        </div>
        {fullscreen && (
          <button className="toolbar-btn toolbar-btn-compact" onClick={() => setFullscreen(false)} aria-label="Exit fullscreen">
            <X size={16} />
          </button>
        )}
      </div>

      <ChartControls
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        chartType={chartType}
        onChartTypeChange={setChartType}
        activeIndicators={activeIndicators}
        onToggleIndicator={toggleIndicator}
        onFullscreen={() => setFullscreen((v) => !v)}
      />

      <div className="price-chart-area" ref={chartAreaRef}>
        {loading ? (
          <div className="price-chart-skeleton" />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={fullscreen ? 420 : 320}>
              <ComposedChart data={data} syncId="cryptoscope-price" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accentColor} stopOpacity={0.32} />
                    <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                  </linearGradient>
                  <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={accentColor} floodOpacity="0.55" />
                  </filter>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="2 6" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                  minTickGap={40}
                />
                <YAxis
                  orientation="right"
                  domain={domain}
                  tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatCompact(v)}
                  width={56}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border-strong)', strokeDasharray: '3 3' }} />

                {chartType === 'line' ? (
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={accentColor}
                    strokeWidth={2}
                    fill="url(#priceFill)"
                    dot={false}
                    activeDot={{ r: 5, fill: 'var(--bg-elevated)', stroke: accentColor, strokeWidth: 2 }}
                    isAnimationActive={ANIMATIONS_ENABLED}
                    animationDuration={450}
                    animationEasing="ease-out"
                    style={{ filter: 'url(#lineGlow)' }}
                  />
                ) : (
                  <Bar dataKey={(d) => [d.low, d.high]} shape={CandleShape} isAnimationActive={ANIMATIONS_ENABLED} animationDuration={350} animationEasing="ease-out" />
                )}

                {activeIndicators.includes('Moving Average') && (
                  <Line
                    type="monotone"
                    dataKey="ma"
                    stroke="#7c93ff"
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={ANIMATIONS_ENABLED}
                    animationDuration={450}
                    animationEasing="ease-out"
                    connectNulls
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={64}>
              <BarChart data={data} syncId="cryptoscope-price" barCategoryGap="28%" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 'dataMax']} />
                <Tooltip content={() => null} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="volume" isAnimationActive={ANIMATIONS_ENABLED} animationDuration={450} animationEasing="ease-out" radius={[2, 2, 0, 0]}>
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.close >= d.open ? 'rgba(53,224,166,0.4)' : 'rgba(251,115,115,0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {activeIndicators.length > 0 && (
        <div className="active-indicators-row">
          {activeIndicators.map((ind) => (
            <span key={ind} className="indicator-chip">
              {ind}
              <button onClick={() => toggleIndicator(ind)} aria-label={`Remove ${ind}`}>
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
