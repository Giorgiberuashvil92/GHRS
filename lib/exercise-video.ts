export type VideoType = 'youtube' | 'direct' | 'unknown';

export function getVideoType(value: string): VideoType {
  if (!value || ['thumbnailFile', 'videoFile'].includes(value)) return 'unknown';
  try {
    const url = new URL(value.trim(), 'https://local.invalid');
    if (!['http:', 'https:'].includes(url.protocol)) return 'unknown';
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (['youtube.com', 'youtu.be'].includes(host)) return 'youtube';
    // Inspect the path; signed storage URLs append credentials after the extension.
    if (/\.(mp4|webm|ogg|m4v|mov|avi|mkv)$/i.test(url.pathname) || ['ghrs-group.com', 'ghrs-group.ru'].includes(host)) return 'direct';
  } catch { /* Invalid URL */ }
  return 'unknown';
}

export function resolveExerciseVideo(exercise: { videoUrl?: string; videoUrlEn?: string }, locale: string): string | undefined {
  const candidates = locale === 'en'
    ? [exercise.videoUrlEn, exercise.videoUrl]
    : [exercise.videoUrl, exercise.videoUrlEn];
  return candidates.find(url => typeof url === 'string' && getVideoType(url) !== 'unknown')?.trim();
}
