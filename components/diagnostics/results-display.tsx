'use client';

import { RecommendationCard, type RecommendationType } from './recommendation-card';

interface ElementScore {
  element: string;
  score: number;
  notes?: string;
}

const ELEMENT_COLORS: Record<string, string> = {
  clarity: 'rgba(100,160,255,0.8)',
  authority: 'rgba(160,120,255,0.8)',
  state: 'rgba(255,200,80,0.8)',
  capacity: 'rgba(80,220,160,0.8)',
  programming: 'rgba(255,100,100,0.8)',
  repetition: 'rgba(80,200,220,0.8)',
  feedback: 'rgba(255,160,80,0.8)',
  time: 'rgba(120,120,255,0.8)',
};

interface ResultsDisplayProps {
  scores: ElementScore[];
  onRetake?: () => void;
  onDone?: () => void;
  recommendations?: RecommendationType[];
}

export function ResultsDisplay({ scores, onRetake, onDone, recommendations }: ResultsDisplayProps) {
  const overallScore = scores.length > 0
    ? Math.round((scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10) / 10
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Overall score */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: 'rgba(180,180,200,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Overall Score</div>
        <div style={{ fontSize: 48, fontWeight: 500, color: 'rgba(230,230,245,0.9)', fontVariantNumeric: 'tabular-nums' }}>
          {overallScore}
          <span style={{ fontSize: 20, color: 'rgba(180,180,200,0.3)' }}>/10</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: 'rgba(180,180,200,0.5)' }}>
          {overallScore >= 8 ? 'Your system is running strong.' :
           overallScore >= 6 ? 'Solid foundation with room to grow.' :
           overallScore >= 4 ? 'Some areas need attention.' :
           'Significant recalibration needed.'}
        </div>
      </div>

      {/* Element breakdown */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: 24,
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 500, color: 'rgba(230,230,245,0.7)', margin: '0 0 16px' }}>Element Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {scores.map((score) => {
            const color = ELEMENT_COLORS[score.element] || 'rgba(180,180,200,0.5)';
            return (
              <div key={score.element}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color, textTransform: 'capitalize' }}>
                    {score.element}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(230,230,245,0.7)', fontVariantNumeric: 'tabular-nums' }}>
                    {score.score}/10
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    borderRadius: 4,
                    background: color,
                    transition: 'width 0.5s',
                    width: `${(score.score / 10) * 100}%`,
                  }} />
                </div>
                {score.notes && (
                  <p style={{ marginTop: 4, fontSize: 11, color: 'rgba(180,180,200,0.4)', fontStyle: 'italic' }}>{score.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendation cards */}
      {recommendations && recommendations.length > 0 && (
        <div>
          {recommendations.map((rec) => (
            <RecommendationCard key={rec} type={rec} />
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        {onRetake && (
          <button
            onClick={onRetake}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: 'rgba(230,230,245,0.7)',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Retake Assessment
          </button>
        )}
        {onDone && (
          <button
            onClick={onDone}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: 'linear-gradient(135deg, rgba(100,160,255,0.9), rgba(80,100,255,0.9))',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Back to Tools
          </button>
        )}
      </div>
    </div>
  );
}
