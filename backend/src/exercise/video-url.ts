// Convert legacy R2 links, including expired signatures, to stable playback URLs.
// Other video providers keep their original URLs.
export function permanentVideoUrl(value: string): string {
  if (!value) return value;
  try {
    const url = new URL(value);
    if (!url.hostname.endsWith('.r2.cloudflarestorage.com')) return value;
    const key = decodeURIComponent(url.pathname.slice(1));
    if (!key.startsWith('admin-videos/') || key.includes('..') || !/\.(mp4|mov|webm)$/i.test(key)) return value;
    const origin = process.env.VIDEO_PLAYBACK_ORIGIN || 'https://ghrs-admin.vercel.app';
    return new URL(`/api/r2/play/${key.split('/').map(encodeURIComponent).join('/')}`, origin).href;
  } catch { return value; }
}
