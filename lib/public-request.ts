// Only for shared public catalog data. Never use this for account or access requests.
const responses = new Map<string, { value: unknown; expiresAt: number }>();
const pending = new Map<string, Promise<unknown>>();
export function getPublicJson<T>(url: string, { force = false, maxAgeMs = 15000 } = {}): Promise<T> {
  const cached = responses.get(url);
  if (!force && cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value as T);
  const existing = pending.get(url);
  if (existing) return existing as Promise<T>;
  const request = fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) }).then(async response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const value: T = await response.json();
    if (responses.size >= 50) responses.delete(responses.keys().next().value!);
    responses.set(url, { value, expiresAt: Date.now() + maxAgeMs });
    return value;
  }).finally(() => pending.delete(url));
  pending.set(url, request);
  return request;
}
