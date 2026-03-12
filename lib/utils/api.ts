// @ts-nocheck
import { NextResponse } from 'next/server';
import { getSession, type TokenPayload } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// ── Standard Response Helpers ──────────────────────────────

export function ok(data: any, meta?: any) {
  return NextResponse.json(
    { ok: true, data, ...(meta ? { meta } : {}) },
    { status: 200 }
  );
}

export const errors = {
  validation(message: string, field?: string) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION_ERROR', message, field } },
      { status: 400 }
    );
  },
  unauthorized(message = 'Authentication required') {
    return NextResponse.json(
      { ok: false, error: { code: 'UNAUTHORIZED', message } },
      { status: 401 }
    );
  },
  forbidden(message = 'Insufficient permissions') {
    return NextResponse.json(
      { ok: false, error: { code: 'FORBIDDEN', message } },
      { status: 403 }
    );
  },
  notFound(resource = 'Resource') {
    return NextResponse.json(
      { ok: false, error: { code: 'NOT_FOUND', message: `${resource} not found` } },
      { status: 404 }
    );
  },
  conflict(message: string) {
    return NextResponse.json(
      { ok: false, error: { code: 'CONFLICT', message } },
      { status: 409 }
    );
  },
  internal(message = 'Internal server error') {
    return NextResponse.json(
      { ok: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 }
    );
  },
};

// ── Auth Middleware for Route Handlers ──────────────────────

export async function requireAuth(): Promise<
  { session: TokenPayload; error?: never } | { session?: never; error: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return { error: errors.unauthorized() };
  }
  return { session };
}

// ── Tier Lookup (D-4: always fetch from DB, never from JWT) ──

export async function getUserTier(userId: string): Promise<string> {
  const [userRecord] = await db.select({ subscription: users.subscription })
    .from(users).where(eq(users.id, userId)).limit(1);
  return userRecord?.subscription || 'free';
}
