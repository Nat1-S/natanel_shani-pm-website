const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = 60_000; // 1 minute

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || Date.now() - entry.ts > TTL) return null;
  return entry.data as T;
}

export function setCache(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() });
}
