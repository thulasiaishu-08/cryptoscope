// Custom recharts <Bar> shape for a range-bar dataKey (d) => [d.low, d.high].
// Recharts already gives us the pixel y/height spanning [low, high], so we
// derive the open/close body position by linear-interpolating within that
// same pixel span instead of needing direct access to the y-axis scale.
export function CandleShape(props) {
  const { x, y, width, height, payload } = props;
  if (payload.open == null || !height) return null;

  const { open, close, high, low } = payload;
  const isUp = close >= open;
  const color = isUp ? 'var(--accent)' : 'var(--negative)';
  const range = high - low || 1;
  const pixelFor = (v) => y + ((high - v) / range) * height;

  const bodyTop = pixelFor(Math.max(open, close));
  const bodyBottom = pixelFor(Math.min(open, close));
  const bodyHeight = Math.max(bodyBottom - bodyTop, 1.5);
  const wickX = x + width / 2;

  return (
    <g>
      <line x1={wickX} x2={wickX} y1={y} y2={y + height} stroke={color} strokeWidth={1} />
      <rect x={x + width * 0.2} y={bodyTop} width={width * 0.6} height={bodyHeight} fill={color} rx={1} />
    </g>
  );
}
