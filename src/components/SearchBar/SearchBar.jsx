import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatUsd } from '../../utils/format';
import { ANIMATIONS_ENABLED } from '../../utils/animationConfig';
import './SearchBar.css';

export function SearchBar({ autoFocus = false, onClose }) {
  const { coins, selectCoin } = useApp();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const dropRef = useRef(null);
  const inputRef = useRef(null);

  const results = coins.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.symbol.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (ANIMATIONS_ENABLED && open && dropRef.current) {
      gsap.fromTo(dropRef.current, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' });
    }
  }, [open]);

  function handleSelect(symbol) {
    selectCoin(symbol);
    setOpen(false);
    setQuery('');
    onClose?.();
  }

  return (
    <div className="searchbar" ref={wrapRef}>
      <div className="searchbar-field">
        <Search size={15} className="searchbar-icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Search coins, tokens, contracts..."
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
              e.currentTarget.blur();
            }
            if (e.key === 'Enter' && results[0]) handleSelect(results[0].symbol);
          }}
          aria-label="Search coins, tokens, contracts"
        />
      </div>

      {open && (
        <div className="searchbar-dropdown" ref={dropRef} role="listbox">
          {results.length === 0 ? (
            <div className="searchbar-empty">No results for "{query}"</div>
          ) : (
            results.map((c) => (
              <button key={c.symbol} className="searchbar-result" onClick={() => handleSelect(c.symbol)} role="option">
                <span className="searchbar-result-icon" style={{ background: c.color }}>
                  {c.symbol.slice(0, 1)}
                </span>
                <span className="searchbar-result-name">
                  <span className="searchbar-result-title">{c.name}</span>
                  <span className="searchbar-result-symbol">{c.symbol}</span>
                </span>
                <span className="searchbar-result-price mono">{formatUsd(c.price)}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
