export const CF_RECORD = '_cf.oldwitch.dynv6.net';
export function validateTunnelURL(raw) {
  if (typeof raw !== 'string' || raw.length > 200) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' || u.username || u.password || u.port || u.search || u.hash || u.pathname !== '/') return null;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.trycloudflare\.com$/.test(u.hostname)) return null;
    return u.origin + '/';
  } catch { return null; }
}
export function parseRecord(value) {
  if (typeof value !== 'string') return null;
  // Google DoH represents a TXT RR as one or more quoted DNS character strings.
  if (value.startsWith('"')) {
    const chunks = value.match(/"(?:[^"\\]|\\.)*"/g);
    if (!chunks || chunks.join(' ') !== value.trim()) return null;
    try { value = chunks.map(s => JSON.parse(s)).join(''); } catch { return null; }
  }
  if (!value.startsWith('v=1;url=')) return null;
  return validateTunnelURL(value.slice(8));
}
export function pickRecord(document) {
  if (!document || document.Status !== 0) return null;
  const values = [...new Set((document.Answer || []).filter(r => r.type === 16).map(r => parseRecord(r.data)).filter(Boolean))];
  return values.length === 1 ? values[0] : null;
}
