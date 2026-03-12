/**
 * Signal Suite Storage Adapter
 *
 * Replaces `window.storage` (artifact persistent storage) with platform API calls.
 * Tools call window.storage.get/set/delete — this adapter intercepts those calls
 * and routes them to /api/v1/signal/[toolId].
 */

export function createSignalStorageAdapter(toolId: string) {
  return {
    async get(key: string, _shared?: boolean) {
      try {
        const res = await fetch(`/api/v1/signal/${toolId}?key=${encodeURIComponent(key)}`);
        if (!res.ok) throw new Error('Storage get failed');
        const data = await res.json();
        if (!data.data) return null;
        return { key, value: typeof data.data.value === 'string' ? data.data.value : JSON.stringify(data.data.value) };
      } catch (e) {
        console.error('Signal storage get error:', e);
        return null;
      }
    },

    async set(key: string, value: any, _shared?: boolean) {
      try {
        let parsed = value;
        if (typeof value === 'string') {
          try { parsed = JSON.parse(value); } catch { parsed = value; }
        }
        const res = await fetch(`/api/v1/signal/${toolId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: parsed }),
        });
        if (!res.ok) throw new Error('Storage set failed');
        return { key, value };
      } catch (e) {
        console.error('Signal storage set error:', e);
        return null;
      }
    },

    async delete(key: string, _shared?: boolean) {
      try {
        const res = await fetch(`/api/v1/signal/${toolId}?key=${encodeURIComponent(key)}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Storage delete failed');
        return { key, deleted: true };
      } catch (e) {
        console.error('Signal storage delete error:', e);
        return null;
      }
    },

    async list(prefix?: string, _shared?: boolean) {
      // Not used by any current tool, stub for compatibility
      return { keys: [], prefix };
    },
  };
}

/**
 * Install storage adapter on window for a specific tool.
 * Call before rendering the tool component.
 */
export function installStorageAdapter(toolId: string) {
  if (typeof window !== 'undefined') {
    (window as any).storage = createSignalStorageAdapter(toolId);
  }
}

/**
 * Save a completed tool result to the platform.
 */
export async function saveSignalResult(toolId: string, data: {
  payload: any;
  energyDimensions?: Record<string, number>;
  careerFamilies?: Record<string, number>;
  primaryFamily?: string;
  secondaryFamily?: string;
}) {
  try {
    const res = await fetch(`/api/v1/signal/${toolId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Result save failed');
    return await res.json();
  } catch (e) {
    console.error('Signal result save error:', e);
    return null;
  }
}
