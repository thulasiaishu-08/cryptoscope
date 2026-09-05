import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Header } from './components/Header/Header';
import { CompareModal } from './components/CompareModal/CompareModal';
import { ResearchPage } from './pages/ResearchPage';
import { MarketsPage } from './pages/MarketsPage';
import { WatchlistView } from './components/WatchlistView/WatchlistView';
import { AppProvider } from './context/AppContext';
import { getCoinByIdAsync } from './services/api';
import { ANIMATIONS_ENABLED } from './utils/animationConfig';

// Resolves the :coinId route param to coin data and hands off to the
// (unmodified) ResearchPage — keeping the URL as the single source of truth
// for which coin is being viewed, rather than duplicating it in state.
function ResearchRoute() {
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCoin(null);
    setNotFound(false);
    getCoinByIdAsync(coinId).then((c) => {
      if (cancelled) return;
      if (c) setCoin(c);
      else setNotFound(true);
    });
    return () => {
      cancelled = true;
    };
  }, [coinId]);

  if (notFound) return <Navigate to="/research/bitcoin" replace />;
  if (!coin) return null;
  return <ResearchPage coin={coin} />;
}

// Fades the new page in when the top-level section (Markets / Research /
// Watchlist) changes. Keyed off the first path segment rather than the full
// pathname so switching coins within Research doesn't re-trigger this —
// ResearchPage already animates its own content in on coin change.
function PageTransition({ children }) {
  const location = useLocation();
  const containerRef = useRef(null);
  const prevSection = useRef(null);
  const section = location.pathname.split('/')[1] || '';

  useEffect(() => {
    const el = containerRef.current;
    if (ANIMATIONS_ENABLED && el && prevSection.current !== null && prevSection.current !== section) {
      gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }
    prevSection.current = section;
  }, [section]);

  return <div ref={containerRef}>{children}</div>;
}

function AppContent() {
  return (
    <>
      <Header />
      <main>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Navigate to="/research/bitcoin" replace />} />
            <Route path="/research/:coinId" element={<ResearchRoute />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/watchlist" element={<WatchlistView />} />
            <Route path="*" element={<Navigate to="/research/bitcoin" replace />} />
          </Routes>
        </PageTransition>
      </main>
      <CompareModal />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
