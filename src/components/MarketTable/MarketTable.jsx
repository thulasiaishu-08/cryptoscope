import { useEffect, useMemo, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../Card/Card';
import { FilterDropdown } from '../FilterDropdown/FilterDropdown';
import { getMarketsTable } from '../../services/api';
import { formatUsd, formatPercent, formatCompact } from '../../utils/format';
import './MarketTable.css';

const VOLUME_TIERS = ['All', '> $5B', '> $1B', '< $1B'];
const CURRENCIES = ['All', 'USD', 'USDT'];

export function MarketTable({ coin }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exchangeFilter, setExchangeFilter] = useState('All');
  const [pairFilter, setPairFilter] = useState('All');
  const [volumeFilter, setVolumeFilter] = useState('All');
  const [currencyFilter, setCurrencyFilter] = useState('All');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMarketsTable(coin.symbol).then((data) => {
      if (!cancelled) {
        setRows(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [coin.symbol]);

  const exchangeOptions = useMemo(() => ['All', ...new Set(rows.map((r) => r.exchange))], [rows]);
  const pairOptions = useMemo(() => ['All', ...new Set(rows.map((r) => r.pair))], [rows]);

  const filtered = rows.filter((r) => {
    if (exchangeFilter !== 'All' && r.exchange !== exchangeFilter) return false;
    if (pairFilter !== 'All' && r.pair !== pairFilter) return false;
    if (currencyFilter !== 'All' && !r.pair.endsWith(currencyFilter)) return false;
    if (volumeFilter === '> $5B' && r.volume <= 5e9) return false;
    if (volumeFilter === '> $1B' && r.volume <= 1e9) return false;
    if (volumeFilter === '< $1B' && r.volume >= 1e9) return false;
    return true;
  });

  return (
    <section className="section">
      <h2 className="section-title">Markets</h2>

      <div className="market-filters">
        <FilterDropdown label="Exchange" options={exchangeOptions} value={exchangeFilter} onChange={setExchangeFilter} />
        <FilterDropdown label="Pair" options={pairOptions} value={pairFilter} onChange={setPairFilter} />
        <FilterDropdown label="Volume" options={VOLUME_TIERS} value={volumeFilter} onChange={setVolumeFilter} />
        <FilterDropdown label="Currency" options={CURRENCIES} value={currencyFilter} onChange={setCurrencyFilter} />
      </div>

      <Card className="market-table-card">
        {loading ? (
          <div className="market-table-loading">Loading markets…</div>
        ) : (
          <>
            <table className="market-table">
              <thead>
                <tr>
                  <th>Exchange</th>
                  <th>Pair</th>
                  <th>Price</th>
                  <th>24h Change</th>
                  <th>Volume</th>
                  <th>Liquidity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={`${row.exchange}-${row.pair}`}>
                    <td className="market-exchange-cell">{row.exchange}</td>
                    <td className="mono">{row.pair}</td>
                    <td className="mono">{formatUsd(row.price)}</td>
                    <td>
                      <span className={`market-change ${row.change24h >= 0 ? 'positive' : 'negative'}`}>
                        {row.change24h >= 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                        {formatPercent(row.change24h)}
                      </span>
                    </td>
                    <td className="mono">${formatCompact(row.volume)}</td>
                    <td>
                      <span className={`liquidity-badge liquidity-${row.liquidity.toLowerCase()}`}>{row.liquidity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="market-cards">
              {filtered.map((row) => (
                <div key={`${row.exchange}-${row.pair}`} className="market-card">
                  <div className="market-card-top">
                    <span className="market-card-exchange">{row.exchange}</span>
                    <span className={`market-change ${row.change24h >= 0 ? 'positive' : 'negative'}`}>
                      {row.change24h >= 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                      {formatPercent(row.change24h)}
                    </span>
                  </div>
                  <div className="market-card-pair mono">{row.pair}</div>
                  <div className="market-card-bottom">
                    <span className="mono">{formatUsd(row.price)}</span>
                    <span className="mono">${formatCompact(row.volume)}</span>
                    <span className={`liquidity-badge liquidity-${row.liquidity.toLowerCase()}`}>{row.liquidity}</span>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && <div className="market-table-empty">No markets match these filters.</div>}
          </>
        )}
      </Card>
    </section>
  );
}
