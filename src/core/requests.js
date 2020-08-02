import {proxies} from '../core/config.js'

class Request{
	constructor(url){
		this.url = url
		this.proxyProvider = new ProxyProvider(proxies)
	}

	append(key, value){
		if (!this.url.endsWith("&")) this.url += "?"
		this.url += key+"="+value+"&";
	}

	loadJson(){	
		return this.loadRaw().then((data) => data.json())
	}
	

	loadRaw(){	
		console.log("Fetching url", this.url)
		let proxy = this.proxyProvider.getNextProxy();
		let resultUrl = proxy+this.url;
		let request = this

		return fetch(resultUrl, {method:"GET"}).catch((e) =>{
			console.log("Error while fetching", proxy+this.url, error)
			request.proxyProvider.fail()
			return request.loadRaw()
		})
	}


	appendAll(params){
		Object.keys(params).forEach(key => this.append(key, params[key]))
	}
}

class ProxyProvider{
	constructor(proxyList){
		this.proxyList = proxyList;
		this.pointer = 0;
		this.currentProxy = proxyList[this.pointer]
	}

	getNextProxy(){
		return this.currentProxy;
	}

	fail(){
		console.log("Proxy failed", this.currentProxy)
		this.currentProxy = this.proxyList[(++this.pointer)%this.proxyList.length];
		console.log("Trying next:", this.currentProxy)
	}
}


export {Request, ProxyProvider};