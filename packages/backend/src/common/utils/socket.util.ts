export function parseSocketUrl(url: string): {
  urlType: string | null;
  urlId: string | null;
} {
  try {
    const isAbsoluteUrl = url.startsWith('ws://') || url.startsWith('wss://');

    const baseUrl = 'ws://localhost';
    const fullUrl = isAbsoluteUrl ? url : `${baseUrl}${url}`;

    const { pathname } = new URL(fullUrl);

    const parts = pathname.split('/').filter((part) => part.length > 0);

    if (parts.length >= 2) {
      return { urlType: parts[1], urlId: parts[2] };
    } else {
      return { urlType: null, urlId: null };
    }
  } catch (error) {
    return { urlType: null, urlId: null };
  }
}
