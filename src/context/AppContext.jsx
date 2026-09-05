import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { COINS, getCoinBySymbol, getCoinById } from '../data/mockCoins';

const AppContext = createContext(null);
const WATCHLIST_KEY = 'cryptoscope:watchlist';

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY);
      return raw ? JSON.parse(raw) : ['BTC'];
    } catch {
      return ['BTC'];
    }
  });
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch {
      // storage unavailable — watchlist just won't persist across reloads
    }
  }, [watchlist]);

  // The "active" coin is whatever /research/:coinId currently points to —
  // derived from the URL rather than tracked separately, so it can never
  // drift out of sync with what's on screen.
  const routeMatch = matchPath('/research/:coinId', location.pathname);
  const activeCoin = routeMatch ? getCoinById(routeMatch.params.coinId) : null;
  const activeSymbol = activeCoin?.symbol ?? 'BTC';

  const toggleWatchlist = useCallback((symbol) => {
    setWatchlist((prev) => (prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]));
  }, []);

  const isWatched = useCallback((symbol) => watchlist.includes(symbol), [watchlist]);

  const selectCoin = useCallback(
    (symbolOrId) => {
      const coin = getCoinBySymbol(symbolOrId) ?? getCoinById(symbolOrId);
      if (coin) navigate(`/research/${coin.id}`);
    },
    [navigate]
  );

  const value = useMemo(
    () => ({
      coins: COINS,
      activeSymbol,
      selectCoin,
      watchlist,
      toggleWatchlist,
      isWatched,
      compareOpen,
      setCompareOpen,
    }),
    [activeSymbol, selectCoin, watchlist, toggleWatchlist, isWatched, compareOpen]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
