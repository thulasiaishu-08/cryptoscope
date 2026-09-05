import { useMemo, useState } from 'react';
import { Search, TrendingUp, TrendingDown, Flame, ArrowUp, ArrowDown } from 'lucide-react';
import { StatCard } from '../components/StatCard/StatCard';
import { Card } from '../components/Card/Card';
import { CoinIcon } from '../components/CoinIcon/CoinIcon';
import { FilterDropdown } from '../components/FilterDropdown/FilterDropdown';
import { CoinsTable } from '../components/CoinsTable/CoinsTable';
import { useApp } from '../context/AppContext';
import { formatUsd, formatPercent, formatCompact } from '../utils/format';
import './MarketsPage.css';

const SORT_OPTIONS = ['Rank', 'Price', '24h Change', 'Market Cap', 'Volume'];

const SORTERS = {
  Rank: (a, b) => a.rank - b.rank,
  Price: (a, b) => b.price - a.price,
  '24h Change': (a, b) => b.change24h - a.change24h,
  'Market Cap': (a, b) => b.marketCap - a.marketCap,
  Volume: (a, b) => b.volume24h - a.volume24h,
};

function MoverCard({ coin, onClick }) {
  const isPositive = coin.change24h >= 0;
  return (
    <Card as="button" hoverable className="mover-card" onClick={onClick}>
      <CoinIcon coin={coin} size={34} />
      <div className="mover-card-info">
        <span className="mover-card-name">{coin.name}</span>
        <span className="mover-card-symbol">{coin.symbol}</span>
      </div>
      <div className="mover-card-figures">
        <span className="mover-card-price mono">{formatUsd(coin.price)}</span>
        <span className={`mover-card-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
          {formatPercent(coin.change24h)}
        </span>
      </div>
    </Card>
  );
}

function TrendingChip({ coin, onClick }) {
  const isPositive = coin.change24h >= 0;
  return (
    <Card as="button" hoverable className="trending-chip" onClick={onClick}>
      <CoinIcon coin={coin} size={26} />
      <span className="trending-chip-symbol">{coin.symbol}</span>
      <span className={`trending-chip-change ${isPositive ? 'positive' : 'negative'}`}>{formatPercent(coin.change24h)}</span>
    </Card>
  );
}

export function MarketsPage() {
  const { coins, selectCoin } = useApp();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('Rank');

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? coins.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)) : coins;
    return [...filtered].sort(SORTERS[sortBy]);
  }, [coins, query, sortBy]);

  const totalMarketCap = useMemo(() => coins.reduce((sum, c) => sum + c.marketCap, 0), [coins]);
  const totalVolume = useMemo(() => coins.reduce((sum, c) => sum + c.volume24h, 0), [coins]);
  const btcDominance = useMemo(() => {
    const btc = coins.find((c) => c.symbol === 'BTC');
    return btc && totalMarketCap ? (btc.marketCap / totalMarketCap) * 100 : 0;
  }, [coins, totalMarketCap]);
  const gainersCount = useMemo(() => coins.filter((c) => c.change24h >= 0).length, [coins]);
  const losersCount = coins.length - gainersCount;

  const gainers = useMemo(() => coins.filter((c) => c.change24h > 0).sort((a, b) => b.change24h - a.change24h).slice(0, 3), [coins]);
  const losers = useMemo(() => coins.filter((c) => c.change24h < 0).sort((a, b) => a.change24h - b.change24h).slice(0, 3), [coins]);
  const trending = useMemo(() => [...coins].sort((a, b) => b.volume24h - a.volume24h).slice(0, 4), [coins]);

  function goToCoin(coin) {
    selectCoin(coin.id);
  }

  return (
    <div className="container markets-page">
      <div className="markets-page-header">
        <h1 className="markets-page-title">Markets</h1>
        <p className="markets-page-subtitle">Live snapshot across {coins.length} tracked assets.</p>
      </div>

      <div className="markets-controls">
        <div className="markets-search">
          <Search size={15} className="markets-search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coins..."
            aria-label="Search coins"
          />
        </div>
        <FilterDropdown label="Sort" options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
      </div>

      <div className="stats-grid markets-summary-grid">
        <StatCard label="Total Market Cap" value={totalMarketCap} format={(v) => '$' + formatCompact(v)} />
        <StatCard label="24h Volume" value={totalVolume} format={(v) => '$' + formatCompact(v)} />
        <StatCard label="BTC Dominance" value={btcDominance} format={(v) => v.toFixed(1) + '%'} />
        <StatCard label="Market Sentiment" value={`${gainersCount} Up · ${losersCount} Down`} />
      </div>

      {gainers.length > 0 && (
        <section className="section">
          <h2 className="section-title">
            <TrendingUp size={15} className="positive" /> Top Gainers
          </h2>
          <div className="movers-grid">
            {gainers.map((c) => (
              <MoverCard key={c.id} coin={c} onClick={() => goToCoin(c)} />
            ))}
          </div>
        </section>
      )}

      {losers.length > 0 && (
        <section className="section">
          <h2 className="section-title">
            <TrendingDown size={15} className="negative" /> Top Losers
          </h2>
          <div className="movers-grid">
            {losers.map((c) => (
              <MoverCard key={c.id} coin={c} onClick={() => goToCoin(c)} />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">
          <Flame size={15} style={{ color: 'var(--gold)' }} /> Trending Coins
        </h2>
        <div className="trending-row">
          {trending.map((c) => (
            <TrendingChip key={c.id} coin={c} onClick={() => goToCoin(c)} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">All Coins</h2>
        <CoinsTable coins={filteredSorted} onSelect={goToCoin} />
      </section>
    </div>
  );
}
