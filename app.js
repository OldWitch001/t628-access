import { CF_RECORD, pickRecord } from './records.mjs';
const button = document.querySelector('#cf-open');
const status = document.querySelector('#cf-status');
const refresh = document.querySelector('#cf-refresh');
let currentURL = null;
let busy = false;
const fixedRoutes = { fn: 'https://oldwitch.fnos.net/', frp: 'https://www-nas.u889354.nyat.app:37304/', ts: 'http://ts.oldwitch.dynv6.net:5666/', et: 'http://et.oldwitch.dynv6.net:5666/', zt: 'http://zt.oldwitch.dynv6.net:5666/' };
const route = new URLSearchParams(location.search).get('route');
if (Object.hasOwn(fixedRoutes, route)) location.replace(fixedRoutes[route]);
async function load() {
  if (busy) return;
  busy = true; refresh.disabled = true;
  currentURL = null; button.disabled = true; button.textContent = '正在读取地址…';
  status.textContent = '正在查询当前 CF 地址。';
  for (const server of ['https://dns.google/resolve', 'https://cloudflare-dns.com/dns-query']) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7000);
      let document;
      try {
        const response = await fetch(`${server}?name=${encodeURIComponent(CF_RECORD)}&type=TXT`, { signal: controller.signal, cache: 'no-store', credentials: 'omit', headers: { Accept: 'application/dns-json' } });
        if (!response.ok) throw new Error('query_failed');
        document = await response.json();
      } finally { clearTimeout(timer); }
      const url = pickRecord(document);
      if (!url) continue;
      currentURL = url; button.disabled = false; button.textContent = '打开 CF 通道 ↗';
      status.textContent = '地址已读取；是否在线以实际打开为准。';
      if (route === 'cf') location.replace(url);
      break;
    } catch { /* Resolver errors contain no credentials; show one bounded UI message below. */ }
  }
  if (!currentURL) { button.textContent = '暂未获取到 CF 地址'; status.textContent = '可刷新重试，或使用 FN Connect / 樱花入口。'; }
  busy = false; refresh.disabled = false;
}
button.addEventListener('click', () => { if (currentURL) window.open(currentURL, '_blank', 'noopener,noreferrer'); });
refresh.addEventListener('click', load);
load();
