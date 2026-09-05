import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, Plus } from 'lucide-react';
import { CoinSelector } from '../CoinSelector/CoinSelector';
import { useApp } from '../../context/AppContext';
import { formatUsd, formatPercent, formatSupply, formatCompact } from '../../utils/format';
import { ANIMATIONS_ENABLED } from '../../utils/animationConfig';
import './CompareModal.css';

const ROWS = [
  { key: 'price', label: 'Price', fmt: (c) => formatUsd(c.price) },
  { key: 'marketCap', label: 'Market Cap', fmt: (c) => '$' + formatCompact(c.marketCap) },
  { key: 'volume24h', label: '24h Volume', fmt: (c) => '$' + formatCompact(c.volume24h) },
  { key: 'circulatingSupply', label: 'Circulating Supply', fmt: (c) => formatSupply(c.circulatingSupply, c.symbol) },
  { key: 'maxSupply', label: 'Max Supply', fmt: (c) => (c.maxSupply ? formatSupply(c.maxSupply, c.symbol) : '∞') },
  { key: 'change24h', label: '24h Change', fmt: (c) => formatPercent(c.change24h), highlight: true },
];

export function CompareModal() {
  const { coins, compareOpen, setCompareOpen, activeSymbol } = useApp();
  const [selected, setSelected] = useState([activeSymbol]);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (compareOpen) {
      setSelected((prev) => (prev.includes(activeSymbol) ? prev : [activeSymbol, ...prev].slice(0, 3)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareOpen]);

  useEffect(() => {
    if (!compareOpen) return;
    document.body.style.overflow = 'hidden';
    if (ANIMATIONS_ENABLED) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(panelRef.current, { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'power3.out' });
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [compareOpen]);

  function close() {
    if (!ANIMATIONS_ENABLED || !panelRef.current || !backdropRef.current) {
      setCompareOpen(false);
      return;
    }
    gsap.to(panelRef.current, { opacity: 0, y: 16, scale: 0.98, duration: 0.2, ease: 'power2.in' });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.2, onComplete: () => setCompareOpen(false) });
  }

  if (!compareOpen) return null;

  const selectedCoins = selected.map((sym) => coins.find((c) => c.symbol === sym)).filter(Boolean);

  return (
    <div className="compare-backdrop" ref={backdropRef} onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="compare-panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Compare coins">
        <div className="compare-header">
          <h2>Compare Coins</h2>
          <button className="compare-close" onClick={close} aria-label="Close compare">
            <X size={18} />
          </button>
        </div>

        <div className="compare-selectors">
          {[0, 1, 2].map((i) => {
            const coin = selectedCoins[i];
            return (
              <div key={i} className="compare-selector-slot">
                {i > 0 && <span className="compare-vs">vs</span>}
                <CoinSelector
                  coin={coin}
                  coins={coins}
                  excludeSymbols={selected}
                  label={i === selected.length ? 'Add coin' : 'Select coin'}
                  onSelect={(symbol) =>
                    setSelected((prev) => {
                      const next = [...prev];
                      next[i] = symbol;
                      return next;
                    })
                  }
                  onClear={
                    selected.length > 1
                      ? () =>
                          setSelected((prev) => prev.filter((_, idx) => idx !== i))
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>

        {selectedCoins.length < 2 ? (
          <div className="compare-hint">
            <Plus size={14} /> Select at least two coins to compare.
          </div>
        ) : (
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  {selectedCoins.map((c) => (
                    <th key={c.symbol}>{c.symbol}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.key}>
                    <td className="compare-row-label">{row.label}</td>
                    {selectedCoins.map((c) => (
                      <td key={c.symbol} className={row.highlight ? (c[row.key] >= 0 ? 'positive' : 'negative') : ''}>
                        <span className="mono">{row.fmt(c)}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
