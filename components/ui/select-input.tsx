'use client';

interface SelectOption {
  value: string;
  label: string;
  score?: number;
}

interface SelectInputProps {
  value: string | null;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export function SelectInput({ value, onChange, options }: SelectInputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderRadius: 8,
            border: value === option.value
              ? '1px solid rgba(100,160,255,0.5)'
              : '1px solid rgba(255,255,255,0.08)',
            padding: '12px 16px',
            textAlign: 'left',
            fontSize: 14,
            background: value === option.value
              ? 'rgba(100,160,255,0.08)'
              : 'rgba(255,255,255,0.02)',
            color: value === option.value
              ? 'rgba(180,210,255,0.9)'
              : 'rgba(230,230,245,0.6)',
            cursor: 'pointer',
            transition: 'all 0.15s',
            outline: 'none',
          }}
        >
          <div style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: value === option.value
              ? '2px solid rgba(100,160,255,0.8)'
              : '2px solid rgba(255,255,255,0.15)',
            background: value === option.value
              ? 'linear-gradient(135deg, rgba(100,160,255,0.9), rgba(80,100,255,0.9))'
              : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s',
          }}>
            {value === option.value && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span style={{ lineHeight: 1.4 }}>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
