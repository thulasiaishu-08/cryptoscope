import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ANIMATIONS_ENABLED } from '../utils/animationConfig';
import { CoinHeader } from '../components/CoinHeader/CoinHeader';
import { StatCard } from '../components/StatCard/StatCard';
import { PriceChart } from '../components/PriceChart/PriceChart';
import { Tabs } from '../components/Tabs/Tabs';
import { MarketOverview } from '../components/MarketOverview/MarketOverview';
import { HolderDistribution } from '../components/HolderDistribution/HolderDistribution';
import { TokenSupply } from '../components/TokenSupply/TokenSupply';
import { MarketTable } from '../components/MarketTable/MarketTable';
import { formatCompact, formatSupply } from '../utils/format';
import './ResearchPage.css';

const TABS = ['Overview', 'Markets', 'Holders', 'Supply'];

export function ResearchPage({ coin }) {
  const [tab, setTab] = useState('Overview');
  const pageRef = useRef(null);

  useEffect(() => {
    setTab('Overview');
  }, [coin.symbol]);

  useEffect(() => {
    if (!ANIMATIONS_ENABLED || !pageRef.current) return;
    gsap.fromTo(pageRef.current.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' });
  }, [coin.symbol]);

  return (
    <div className="container research-page" ref={pageRef}>
      <CoinHeader coin={coin} />

      <div className="key-stats-grid">
        <StatCard label="Market Cap" value={coin.marketCap} format={(v) => '$' + formatCompact(v)} />
        <StatCard label="24h Volume" value={coin.volume24h} format={(v) => '$' + formatCompact(v)} />
        <StatCard label="Circulating Supply" value={formatSupply(coin.circulatingSupply, coin.symbol)} />
        <StatCard label="Max Supply" value={coin.maxSupply ? formatSupply(coin.maxSupply, coin.symbol) : '∞'} />
      </div>

      <PriceChart coin={coin} />

      <div className="research-tabs-wrap">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'Overview' && (
        <>
          <MarketOverview coin={coin} />
          <HolderDistribution coin={coin} />
          <TokenSupply coin={coin} />
        </>
      )}
      {tab === 'Markets' && <MarketTable coin={coin} />}
      {tab === 'Holders' && <HolderDistribution coin={coin} />}
      {tab === 'Supply' && <TokenSupply coin={coin} />}
    </div>
  );
}
