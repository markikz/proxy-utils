class ProxyUtils {
    constructor(proxyHotsPool, proxy_key) {
        this.proxyPool = [];
        this.aliveProxies = [];
        if (proxyHotsPool && proxyHotsPool.length) {
            proxyHotsPool.forEach(proxy => console.log(`Proxy change state to UP: ${ proxy }`));
            this.proxyPool = [...proxyHotsPool];
            this.aliveProxies = [...this.proxyPool];
        }
        this.timedOutProxies = [];
        this.proxy_key = proxy_key;
        this.priceOverviewCalls = 0;
    }

    getAliveProxies() {
        return this.aliveProxies;
    }

    composeUrl(url, proxy) {
        return `${ proxy }/redirect?address=${ encodeURIComponent(url) }&key=${ this.proxy_key }`;
    }

    getNextProxy() {
        this.priceOverviewCalls++;
        return this.aliveProxies[this.priceOverviewCalls % this.aliveProxies.length];
    }

    timeoutProxy(proxy) {
        if (!proxy || this.timedOutProxies.includes(proxy))
            return;
        this.aliveProxies.splice(this.aliveProxies.indexOf(proxy))

        console.log(`Proxy change state to TIMEOUT: ${ proxy }`);

        this.timedOutProxies.push(proxy);
        setTimeout(() => {
            console.log(`Proxy change state to UP: ${ proxy }`);
            this.aliveProxies.push(proxy);
        }, 60 * 60 * 1000);
    }

    fetch(url) {
        if (!this.aliveProxies.length){
            return Promise.resolve('{"success": false, "error": "proxy pool is empty"}');
        }

        const proxy = this.getNextProxy();
        const urlToFetch = this.composeUrl(url, proxy);

        console.log({urlToFetch});

        return fetch(urlToFetch)
            .then(res => {
                if (res.status === 429) {
                    this.timeoutProxy(proxy);
                    return this.fetch(url);
                }
                return res.json();
            })
            .catch(error => {
                console.error('------------------------------------------------ProxyUtils.fetch: ' + error);
                return Promise.resolve(`{"success": false, "error": "${ error }"}`);
            });
    }

    fetchText(url) {
        if (!this.aliveProxies.length){
            return Promise.resolve('{"success": false, "error": "proxy pool is empty"}');
        }

        const proxy = this.getNextProxy();
        const urlToFetch = this.composeUrl(url, proxy);

        console.log({urlToFetch});

        return fetch(urlToFetch)
            .then(res => {
                if (res.status === 429) {
                    this.timeoutProxy(this.aliveProxies.splice(this.aliveProxies.indexOf(proxy)));
                    return this.fetchText(url);
                }
                return res.text();
            })
            .catch(error => {
                console.error('------------------------------------------------ProxyUtils.fetch: ' + error);
                return Promise.resolve(`{"success": false, "error": "${ error }"}`);
            });
    }
}

module.exports = ProxyUtils;
