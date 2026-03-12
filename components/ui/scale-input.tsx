'use client';

interface ScaleInputProps {
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  lowLabel: string;
  highLabel: string;
}

export function ScaleInput({
  value,
  onChange,
  min = 1,
  max = 10,
  lowLabel,
  highLabel,
}: ScaleInputProps) {
  const points = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {points.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            style={{
              flex: '1 1 0',
              minWidth: 36,
              maxWidth: 48,
              aspectRatio: '1',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              border: value === n ? '1px solid rgba(100,160,255,0.6)' : '1px solid rgba(255,255,255,0.1)',
              background: value === n
                ? 'linear-gradient(135deg, rgba(100,160,255,0.9), rgba(80,100,255,0.9))'
                : 'rgba(255,255,255,0.04)',
              color: value === n ? '#fff' : 'rgba(230,230,245,0.6)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              transform: value === n ? 'scale(1.05)' : 'scale(1)',
              outline: 'none',
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(180,180,200,0.4)' }}>
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
