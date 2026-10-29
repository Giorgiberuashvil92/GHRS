export function mergeMessages(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const left = target[key], right = source[key];
    result[key] = left && right && typeof left === 'object' && typeof right === 'object'
      ? mergeMessages(left as Record<string, unknown>, right as Record<string, unknown>) : right;
  }
  return result;
}
