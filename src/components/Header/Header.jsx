import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Radar, Star, GitCompareArrows, Settings, Menu, X, Search as SearchIcon } from 'lucide-react';
import { SearchBar } from '../SearchBar/SearchBar';
import { useApp } from '../../context/AppContext';
import './Header.css';

const NAV_ITEMS = [
  { label: 'Research', path: '/research/bitcoin', isActive: (pathname) => pathname.startsWith('/research') },
  { label: 'Markets', path: '/markets', isActive: (pathname) => pathname.startsWith('/markets') },
  { label: 'Watchlist', path: '/watchlist', isActive: (pathname) => pathname.startsWith('/watchlist') },
];

export function Header() {
  const { setCompareOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  function handleNavClick(path) {
    setMobileMenuOpen(false);
    navigate(path);
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="header-left">
          <button
            className="header-menu-btn"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <a href="/research/bitcoin" className="header-logo" onClick={(e) => { e.preventDefault(); handleNavClick('/research/bitcoin'); }}>
            <span className="header-logo-mark">
              <Radar size={16} strokeWidth={2.4} />
            </span>
            <span>CryptoScope</span>
          </a>
          <nav className="header-nav" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className={`header-nav-link ${item.isActive(location.pathname) ? 'header-nav-link-active' : ''}`}
                onClick={() => handleNavClick(item.path)}
                aria-current={item.isActive(location.pathname) ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="header-center">
          <SearchBar />
        </div>

        <div className="header-right">
          <button className="header-icon-btn mobile-only" aria-label="Search" onClick={() => setMobileSearchOpen((v) => !v)}>
            <SearchIcon size={18} />
          </button>
          <button className="header-icon-btn" aria-label="Watchlist" onClick={() => navigate('/watchlist')}>
            <Star size={18} />
          </button>
          <button className="header-compare-btn desktop-only" onClick={() => setCompareOpen(true)}>
            <GitCompareArrows size={15} />
            Compare
          </button>
          <button className="header-icon-btn desktop-only" aria-label="Settings">
            <Settings size={18} />
          </button>
          <div className="header-avatar" aria-hidden="true">JD</div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="header-mobile-search container">
          <SearchBar autoFocus onClose={() => setMobileSearchOpen(false)} />
        </div>
      )}

      {mobileMenuOpen && (
        <div className="header-mobile-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`header-mobile-nav-link ${item.isActive(location.pathname) ? 'header-mobile-nav-link-active' : ''}`}
              onClick={() => handleNavClick(item.path)}
              aria-current={item.isActive(location.pathname) ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
          <button
            className="header-mobile-nav-link"
            onClick={() => {
              setCompareOpen(true);
              setMobileMenuOpen(false);
            }}
          >
            Compare
          </button>
        </div>
      )}
    </header>
  );
}
