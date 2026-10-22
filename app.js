const fixedRoutes = {
  fn: 'https://oldwitch.fnos.net/',
  frp: 'https://www-nas.u889354.nyat.app:37304/',
  miao: 'https://16b507f9a0e8.ofalias.net:59037/',
  ts: 'http://ts.oldwitch.dynv6.net:5666/',
  et: 'http://et.oldwitch.dynv6.net:5666/',
  zt: 'http://zt.oldwitch.dynv6.net:5666/'
};
const route = new URLSearchParams(location.search).get('route');
if (Object.hasOwn(fixedRoutes, route)) {
  location.replace(fixedRoutes[route]);
}
