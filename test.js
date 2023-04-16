const proxy = require("./proxy-utils");
const proxyUtils = new proxy(["http://localhost:5000"], 'aInun8IgX934');

console.log(proxyUtils.fetch("https://steamcommunity.com/market/search/render/?search_descriptions=1&sort_column=hash_name&sort_dir=desc&appid=730&norender=2&count=1&start=10", ).then(console.log));
console.log(proxyUtils.test());