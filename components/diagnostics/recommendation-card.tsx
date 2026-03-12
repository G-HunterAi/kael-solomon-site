'use client';

import Link from 'next/link';

export type RecommendationType = 'parent-profile' | 'experiment-tracker';

interface RecommendationCardProps {
  type: RecommendationType;
}

const RECOMMENDATIONS = {
  'parent-profile': {
    title: 'Invite a parent or guardian',
    description: 'The Parent Profile compares a parent\'s career wiring to yours — helping them support your path instead of projecting theirs. It takes about 10 minutes.',
    buttonText: 'Share invite link',
    href: '/map/parent-profile',
    tag: 'Companion Tool',
  },
  'experiment-tracker': {
    title: 'Ready to test this in real life?',
    description: 'Log a micro-experiment to see if your results hold up in the real world. Track what you tried, how it felt, and what you learned.',
    buttonText: 'Start tracking experiments',
    href: '/map/experiment-tracker',
    tag: 'Companion Tool',
  },
};

export function RecommendationCard({ type }: RecommendationCardProps) {
  const rec = RECOMMENDATIONS[type];

  return (
    <div style={{
      borderRadius: 12,
      border: '1px solid rgba(100,160,255,0.15)',
      background: 'rgba(100,160,255,0.04)',
      padding: 20,
      marginTop: 16,
    }}>
      <span style={{
        display: 'inline-flex',
        borderRadius: 100,
        padding: '2px 10px',
        fontSize: 10,
        fontWeight: 500,
        color: 'rgba(100,160,255,0.7)',
        background: 'rgba(100,160,255,0.1)',
        marginBottom: 8,
      }}>
        {rec.tag}
      </span>
      <h3 style={{ fontSize: 14, fontWeight: 500, color: 'rgba(230,230,245,0.9)', margin: '8px 0 4px' }}>{rec.title}</h3>
      <p style={{ fontSize: 12, color: 'rgba(180,180,200,0.5)', lineHeight: 1.5, margin: '0 0 12px' }}>{rec.description}</p>
      <Link
        href={rec.href}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          fontWeight: 500,
          color: 'rgba(100,160,255,0.8)',
          textDecoration: 'none',
        }}
      >
        {rec.buttonText} →
      </Link>
    </div>
  );
}
