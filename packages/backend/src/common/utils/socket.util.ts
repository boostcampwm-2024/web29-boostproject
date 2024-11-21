export function parseSocketUrl(url: string): {
  urlType: string | null;
  urlId: string | null;
} {
  if (!url || !url.includes('/')) {
    return { urlType: null, urlId: null };
  }

  const parts = url.split('/').filter(Boolean);

  return parts.length >= 2
    ? { urlType: parts[0], urlId: parts[1] }
    : { urlType: null, urlId: null };
}
