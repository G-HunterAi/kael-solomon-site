// @ts-nocheck
import { db } from '@/lib/db';
import { signalResults } from '@/lib/db/signal-schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * After Signal Check completion, extract career-relevant data.
 */
export async function bridgeSignalToCareer(userId: string, toolId: string) {
  if (!['signal-check', 'energy-pulse'].includes(toolId)) return null;

  const latest = await db.select().from(signalResults)
    .where(and(eq(signalResults.userId, userId), eq(signalResults.toolId, toolId)))
    .orderBy(desc(signalResults.completedAt))
    .limit(1);

  if (latest.length === 0 || !latest[0].energyDimensions) return null;

  return {
    source: toolId,
    energyDimensions: latest[0].energyDimensions as Record<string, number>,
    careerFamilies: latest[0].careerFamilies,
    primary: latest[0].primaryFamily,
    secondary: latest[0].secondaryFamily,
  };
}

/**
 * Get latest energy snapshot merging signal-check (base) + energy-pulse (recent overlay).
 */
export async function getLatestEnergySnapshot(userId: string) {
  const signalCheck = await db.select().from(signalResults)
    .where(and(eq(signalResults.userId, userId), eq(signalResults.toolId, 'signal-check')))
    .orderBy(desc(signalResults.completedAt))
    .limit(1);

  const energyPulse = await db.select().from(signalResults)
    .where(and(eq(signalResults.userId, userId), eq(signalResults.toolId, 'energy-pulse')))
    .orderBy(desc(signalResults.completedAt))
    .limit(7);

  const snapshot: Record<string, number> = {};

  if (signalCheck.length > 0 && signalCheck[0].energyDimensions) {
    const dims = signalCheck[0].energyDimensions as Record<string, number>;
    for (const [k, v] of Object.entries(dims)) snapshot[k] = v;
  }

  if (energyPulse.length > 0) {
    const dimSums: Record<string, number[]> = {};
    for (const entry of energyPulse) {
      if (entry.energyDimensions) {
        const dims = entry.energyDimensions as Record<string, number>;
        for (const [k, v] of Object.entries(dims)) {
          if (!dimSums[k]) dimSums[k] = [];
          dimSums[k].push(v);
        }
      }
    }
    for (const [k, values] of Object.entries(dimSums)) {
      const pulseAvg = values.reduce((s, v) => s + v, 0) / values.length;
      snapshot[k] = snapshot[k] != null
        ? Math.round((snapshot[k] * 0.7 + pulseAvg * 0.3) * 10) / 10
        : Math.round(pulseAvg * 10) / 10;
    }
  }

  return Object.keys(snapshot).length > 0 ? snapshot : null;
}

/**
 * Get experiment insights for gap tracking.
 */
export async function getExperimentInsights(userId: string) {
  const experiments = await db.select().from(signalResults)
    .where(and(eq(signalResults.userId, userId), eq(signalResults.toolId, 'experiment-tracker')))
    .orderBy(desc(signalResults.completedAt))
    .limit(20);

  return experiments.map(exp => {
    const p = exp.payload as any;
    return {
      title: p?.title,
      family: p?.family || exp.primaryFamily,
      type: p?.type,
      energyBefore: p?.energyBefore,
      energyDuring: p?.energyDuring,
      energyAfter: p?.energyAfter,
      delta: (p?.energyAfter || 5) - (p?.energyBefore || 5),
      keepGoing: p?.keepGoing,
      date: exp.completedAt,
    };
  });
}
