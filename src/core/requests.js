import {proxies} from './config.js'
import {URL} from './URL.js'

class Request {
    constructor(url, params) {
        this.url = URL.replaceAll(url, params)
        this.proxyProvider = new ProxyProvider(proxies)
    }


    fetchData() {
        console.log("Fetching url", this.url)
        let proxy = this.proxyProvider.getNextProxy();
        let resultUrl = proxy + this.url;
        let request = this

        //console.log(resultUrl)
        return fetch(resultUrl, {method: "GET"}).catch((e) => {
            //console.log("Error while fetching", proxy+this.url, e)
            request.proxyProvider.fail()
            return request.fetchData()
        })
    }

}

class ProxyProvider {
    constructor(proxyList) {
        this.proxyList = proxyList;
        this.pointer = 0;
        this.currentProxy = proxyList[this.pointer]
    }

    getNextProxy() {
        return this.currentProxy;
    }

    fail() {
        console.log("Proxy failed", this.currentProxy)
        this.currentProxy = this.proxyList[(++this.pointer) % this.proxyList.length];
        if (this.pointer === proxies.length - 1) {
            throw "Proxies are exceeded"
        }
        console.log("Trying next:", this.currentProxy)
    }
}


export {Request, ProxyProvider};