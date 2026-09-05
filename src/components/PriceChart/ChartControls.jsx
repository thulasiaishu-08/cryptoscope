import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SlidersHorizontal, GitCompareArrows, LineChart, CandlestickChart, Settings, Maximize2, ChevronDown } from 'lucide-react';
import { TIMEFRAMES } from '../../data/chartData';
import { ANIMATIONS_ENABLED } from '../../utils/animationConfig';

const INDICATORS = ['Moving Average', 'RSI', 'MACD', 'Bollinger Bands'];

export function ChartControls({ timeframe, onTimeframeChange, chartType, onChartTypeChange, activeIndicators, onToggleIndicator, onFullscreen }) {
  const tabsRef = useRef(null);
  const indicatorBtnRef = useRef(null);
  const [indicatorsOpen, setIndicatorsOpen] = useState(false);

  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs) return;
    const active = tabs.querySelector('.tf-tab-active');
    const indicator = tabs.querySelector('.tf-indicator');
    if (active && indicator) {
      // Animations temporarily disabled — snap instead of tweening.
      const move = ANIMATIONS_ENABLED ? gsap.to : gsap.set;
      move(indicator, {
        left: active.offsetLeft,
        width: active.offsetWidth,
        duration: 0.28,
        ease: 'power2.out',
      });
    }
  }, [timeframe]);

  useEffect(() => {
    function handleClick(e) {
      if (indicatorBtnRef.current && !indicatorBtnRef.current.contains(e.target)) {
        setIndicatorsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="chart-controls">
      <div className="tf-tabs" ref={tabsRef} role="tablist" aria-label="Chart timeframe">
        <div className="tf-indicator" />
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            className={`tf-tab ${tf === timeframe ? 'tf-tab-active' : ''}`}
            onClick={() => onTimeframeChange(tf)}
            role="tab"
            aria-selected={tf === timeframe}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="chart-toolbar">
        <div className="indicators-wrap" ref={indicatorBtnRef}>
          <button className="toolbar-btn" onClick={() => setIndicatorsOpen((v) => !v)} aria-expanded={indicatorsOpen}>
            <SlidersHorizontal size={14} />
            Indicators
            {activeIndicators.length > 0 && <span className="toolbar-badge">{activeIndicators.length}</span>}
            <ChevronDown size={13} />
          </button>
          {indicatorsOpen && (
            <div className="indicators-dropdown">
              {INDICATORS.map((ind) => (
                <label key={ind} className="indicator-option">
                  <input
                    type="checkbox"
                    checked={activeIndicators.includes(ind)}
                    onChange={() => onToggleIndicator(ind)}
                  />
                  {ind}
                </label>
              ))}
            </div>
          )}
        </div>

        <button className="toolbar-btn desktop-only" aria-label="Compare">
          <GitCompareArrows size={14} />
          Compare
        </button>

        <div className="chart-type-toggle" role="group" aria-label="Chart type">
          <button
            className={chartType === 'line' ? 'chart-type-active' : ''}
            onClick={() => onChartTypeChange('line')}
            aria-pressed={chartType === 'line'}
            aria-label="Line chart"
          >
            <LineChart size={14} />
          </button>
          <button
            className={chartType === 'candle' ? 'chart-type-active' : ''}
            onClick={() => onChartTypeChange('candle')}
            aria-pressed={chartType === 'candle'}
            aria-label="Candlestick chart"
          >
            <CandlestickChart size={14} />
          </button>
        </div>

        <button className="toolbar-btn toolbar-btn-compact desktop-only" aria-label="Settings">
          <Settings size={14} />
        </button>
        <button className="toolbar-btn toolbar-btn-compact" aria-label="Fullscreen" onClick={onFullscreen}>
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
}
