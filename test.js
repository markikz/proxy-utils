const proxy = require("./proxy-utils");
const proxyUtils = new proxy(["https://web-production-0dc19.up.railway.app"], '');

proxyUtils.fetch("https://steamcommunity.com/market/search/render/?search_descriptions=1&sort_column=hash_name&sort_dir=desc&appid=730&norender=2&count=1&start=10", ).then(console.log);
console.log(proxyUtils.getAliveProxies());