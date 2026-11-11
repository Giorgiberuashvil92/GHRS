export const extractImageUrl = (input?: string): string | null => {
  if (!input) return null;

  // If input is a simple URL, return it
  if (!input.includes('[') && !input.includes('"')) {
    return input;
  }

  try {
    // Try to parse as JSON
    let parsed = input;
    while (typeof parsed === 'string' && (parsed.includes('[') || parsed.includes('"'))) {
      parsed = JSON.parse(parsed);
      if (Array.isArray(parsed)) {
        parsed = parsed[0];
      }
    }
    return typeof parsed === 'string' ? parsed : null;
  } catch (e) {
    console.error('Failed to parse image URL:', e);
    return null;
  }
};
