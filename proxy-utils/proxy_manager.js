class ProxyUtils {
    constructor(proxyHotsPool, proxy_key) {
        this.proxyHotsPool = proxyHotsPool;
        this.proxy_key = proxy_key;
        this.priceOverviewCalls = 0;
        this.steamAPIThreads = new Array(this.proxyHotsPool.length);
    }

    test() {
        return this.proxyHotsPool;
    }

    fetch(url) {
        let t = this.proxyHotsPool[0] + '/redirect?address=' + encodeURIComponent(url) + "&proxy_key=" + this.proxy_key;
        console.log(t);
        return fetch(t)
            .then(res => {
                return res.json();
            })
            .catch(error => {
                console.error('------------------------------------------------getPrice: ' + error);
                return "123";
            });
    }

}

module.exports = ProxyUtils;
