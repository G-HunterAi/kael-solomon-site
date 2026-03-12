'use client';

import Link from 'next/link';

interface ToolShellProps {
  title: string;
  subtitle?: string;
  duration?: string;
  currentStep?: number;
  totalSteps?: number;
  progress?: number;
  showBackButton?: boolean;
  children: React.ReactNode;
}

export function ToolShell({
  title,
  subtitle,
  duration,
  currentStep,
  totalSteps,
  progress,
  showBackButton = true,
  children,
}: ToolShellProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080810',
        fontFamily: 'var(--font-geist), var(--font-inter), sans-serif',
      }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Back to Map */}
        {showBackButton && (
          <Link
            href="/map"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: 'rgba(100,160,255,0.6)',
              textDecoration: 'none',
              marginBottom: 32,
            }}
          >
            ← Back to Map
          </Link>
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{
              fontSize: 22,
              fontWeight: 500,
              color: 'rgba(230,230,245,0.9)',
              margin: 0,
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{
                fontSize: 14,
                color: 'rgba(180,180,200,0.5)',
                marginTop: 6,
                margin: '6px 0 0',
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {duration && (
            <span style={{
              fontSize: 11,
              color: 'rgba(180,180,200,0.4)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 100,
              padding: '4px 12px',
              whiteSpace: 'nowrap',
            }}>
              {duration}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {totalSteps != null && totalSteps > 0 && currentStep != null && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(180,180,200,0.4)', marginBottom: 8 }}>
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{progress ?? Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(100,160,255,0.9), rgba(80,100,255,0.9))',
                  transition: 'width 0.3s',
                  width: `${((currentStep + 1) / totalSteps) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
