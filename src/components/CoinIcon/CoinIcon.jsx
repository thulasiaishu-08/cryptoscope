export function CoinIcon({ coin, size = 32 }) {
  if (!coin) return null;
  const initials = coin.symbol.slice(0, 1);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.42,
        fontWeight: 700,
        color: '#0a0a0b',
        background: `radial-gradient(circle at 30% 25%, color-mix(in srgb, ${coin.color} 100%, white 35%), ${coin.color} 70%)`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.14) inset, 0 4px 14px -4px color-mix(in srgb, ${coin.color} 70%, transparent)`,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
