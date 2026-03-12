'use client';

interface PercentageInputProps {
  value: number | null;
  onChange: (value: number) => void;
}

function getColor(val: number): string {
  if (val <= 20) return '#ef4444';
  if (val <= 40) return '#f97316';
  if (val <= 60) return '#f59e0b';
  if (val <= 80) return '#34d399';
  return '#10b981';
}

function getLabel(val: number): string {
  if (val <= 20) return 'Very low capacity';
  if (val <= 40) return 'Limited capacity';
  if (val <= 60) return 'Moderate capacity';
  if (val <= 80) return 'Good capacity';
  return 'High capacity';
}

export function PercentageInput({ value, onChange }: PercentageInputProps) {
  const current = value ?? 50;
  const color = getColor(current);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Large percentage display */}
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: 48, fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'rgba(230,230,245,0.9)' }}>
          {current}
        </span>
        <span style={{ fontSize: 24, color: 'rgba(180,180,200,0.4)', marginLeft: 4 }}>%</span>
      </div>

      {/* Slider */}
      <div style={{ padding: '0 4px' }}>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: 6,
            borderRadius: 4,
            appearance: 'none',
            cursor: 'pointer',
            background: `linear-gradient(to right, ${color} 0%, ${color} ${current}%, rgba(255,255,255,0.06) ${current}%, rgba(255,255,255,0.06) 100%)`,
            outline: 'none',
          }}
        />
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(180,180,200,0.4)' }}>
        <span>0% — Maxed out</span>
        <span>100% — Wide open</span>
      </div>

      {/* Interpretation */}
      <div style={{ textAlign: 'center' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          borderRadius: 100,
          padding: '4px 12px',
          fontSize: 12,
          fontWeight: 500,
          color: 'rgba(230,230,245,0.7)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
          {getLabel(current)}
        </span>
      </div>
    </div>
  );
}
