export function NodeField() {
  const nodes = [
    { cx: 60, cy: 90, r: 3.5 },
    { cx: 180, cy: 180, r: 4 },
    { cx: 340, cy: 120, r: 3 },
    { cx: 480, cy: 200, r: 4 },
    { cx: 120, cy: 300, r: 3.5 },
    { cx: 70, cy: 440, r: 3 },
    { cx: 260, cy: 380, r: 4 },
    { cx: 520, cy: 360, r: 3.5 },
    { cx: 200, cy: 530, r: 3 },
    { cx: 460, cy: 540, r: 3.5 },
  ];

  const edges = [
    [60, 90, 180, 180],
    [180, 180, 120, 300],
    [180, 180, 340, 120],
    [340, 120, 480, 200],
    [120, 300, 70, 440],
    [120, 300, 260, 380],
    [480, 200, 520, 360],
    [260, 380, 520, 360],
    [260, 380, 200, 530],
    [520, 360, 460, 540],
  ];

  const pulses = [
    { dur: '3.4s', begin: '0s', path: 'M60,90 L180,180 L340,120 L480,200' },
    { dur: '4.2s', begin: '0.6s', path: 'M120,300 L260,380 L520,360 L460,540' },
    { dur: '3.8s', begin: '1.4s', path: 'M180,180 L120,300 L70,440' },
  ];

  return (
    <svg
      className="pointer-events-none absolute -inset-x-10 -inset-y-10 z-0 h-[calc(100%+80px)] w-[calc(100%+80px)]"
      viewBox="0 0 600 620"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-border" strokeWidth="1" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r={n.r} className="fill-ink-tertiary opacity-55" />
      ))}
      {pulses.map((p, i) => (
        <circle key={i} r="3.2" className="fill-accent">
          <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={p.path} />
          <animate attributeName="opacity" values="0;1;1;0" dur={p.dur} begin={p.begin} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}