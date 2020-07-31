import {injectFunction} from './another.js';
    injectFunction();

const textItemClass = '.player-timedtext';
const playerControlClass = '.PlayerControlsNeo__button-control-row'
const maxWidth = document.body.clientWidth

const config_1 = {
	popupWidth : 270,
	popupTop: 510,
	activationOpacity : "0.95",
	popupClass : "translation-popup",
	
	closePopupClass : "close-popup",

	scrollBarHeight : 381,
	translationScrollBarClass: "translation-scrollbar",
	translationPanelClass: "translation-panel",
	headerClass : "translation-header",
	headerSectionClass : "translation-header-section",
	fullSectionClass: "section-full",

	externalDictsClass: "external-dicts-row",
	externalDictsContainerClass: "external-dicts-container",

	wordEditedId : "edited",
	hoverableWordClass :"hoverable",

	sourceLang : "de",
	targetLang: "ru",

	googleApiUrl: "https://translate.googleapis.com/translate_a/single",
	wiktionaryDeApiUrl: "https://de.wiktionary.org/w/index.php",
	proxies : ["https://cors-anywhere.herokuapp.com/",
				"https://cors-proxy.htmldriven.com/?url=", 
				],

	normalizationServices : [

	],
}
let config = null; 


const replaceWithSpans = (sentence, id, cl) => sentence.replace(/([a-zäüöß'\-]+)/gi, '<span id="'+id+'" class='+cl+'>$1</span>');
const pixel = (any) => any.toString() + "px";
const toClass = (any) => "." + any;
const toId = (any) => "#" + any;

// if buttonClick and tab is not netflix return false




/*####################################################*/

class ExtendedWord {
	constructor(original){// parses all info from wiktionary or another resource
		this.original = original;
		this.mainForm = original; // main form of word word
		this.type = null; // verb noun adj etc
		this.gender = null;
		this.meaning = null;
	}

}

class TranslatedWord{
	constructor(extendedWord, translation){ // normilized Word: ExtendedWord
		this.extendedWord = extendedWord
		this.translation = translation; // each service fives own translation, maybe even several translations
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

class Request{
	constructor(url, method){
		this.url = url
		this.method = method
		this.proxyProvider = new ProxyProvider(config.proxies)
	}

	append(key, value){
		if (!this.url.endsWith("&")) this.url += "?"
		this.url += key+"="+value+"&";
	}

	loadJson(callback){	
		this.loadRaw((data) => callback(data.json()))
	}
	

	loadRaw(callback){	
		console.log("Fetching url", this.url)
		let proxy = this.proxyProvider.getNextProxy()

		self = this
		this.fetchRequest(proxy+this.url,
		(data) => {
			console.log("Fetched data:", data);
			callback(data);
		}, 
		(error) => {
			console.log("Error while fetching", proxy+this.url, error)
			self.proxyProvider.fail()
			this.loadRaw(callback)
		});	
		
	}

	fetchRequest(url, callback, onError){
		fetch(url) //TODO:Promises so it wont freeze
		.then(callback)
		.catch(onError)
	}

	appendAll(params){
		Object.keys(params).forEach(key => this.append(key, params[key]))
	}
}

class WictionaryService{

	constructor(originalWord){
		this.originalWord = originalWord
		this.extendedWord = new ExtendedWord(originalWord);
		this.initialize(originalWord);
	}


	getData(word){
		let api = new Request(config.wiktionaryDeApiUrl, "GET")
		let params = {
			"title" : word,
			"action" : "raw",
		}

		api.appendAll(params)

		api.loadRaw((data)=>{
			console.log("Wictionary", data);
		})
	}

	initialize(originalWord){
		let data = this.getData(originalWord);
		return
		let type = this.parseWordType(data)

		let mainForm = originalWord;

		if (type.includes("Form")){ // If word is not in infinitive or in singular
			mainForm = this.parseMainForm(data);
			data = this.getData(mainForm) //TODO: somehow rearrange code, dirty functions
			type = this.parseWordType(data)
		}

		this.extendedWord.type = type;
		this.extendedWord.mainForm = mainForm;
		this.extendedWord.meaning = this.parseMeaning(data)
	}


	parseByRegex(string, regex){
		if (!string.match(regex)) return false;
		let result = [...string.matchAll(regex)][0]
		return result.groups.result
	}


	parseWordType(raw){
		let type = this.parseByRegex(raw, /{{Wortart\|(?<result>.+)\|Deutsch}}/g);
		if (type == false) return "FAILED_WORDTYPE"
		console.log("Type Of word", type)
		return type;
		
	}

	parseMainForm(raw){
		let main = this.parseByRegex(raw, /{{Grundformverweis.+\|(?<result>.+)\}}/g);
		if (main == false) return "FAILED_MAINFORM"
		console.log("Main Form of word", main)
		return main;

	}

	parseMeaning(raw){
		let regex = /{{Bedeutungen}}(\n|.)*/g // to cut meaining 
		let regex2 = /:\[(\d|\w)\](?<result>.*)\n/g // parse all rows
		if (!raw.match(regex)) return null
		let meaningData = raw.match(regex)[0]

		let results = [...meaningData.matchAll(regex2)].slice(0,3)
		let items = [];
		results.forEach(g => {
			let item = g.groups.result.replace(/(\[|\]|{.*})/g, "")
			console.log("Item of meaning", item.toString());
			items.push(item)
		})
		return items
	}

	getExtendedWord(){
		return this.extendedWord;
	}
	


}

class GoogleService {
	constructor(extendedWord){
		this.extendedWord = extendedWord;
		this.translatedWord = new TranslatedWord(
			this.extendedWord,
			this.parse(this.translate(extendedWord.mainForm, 
									  config.sourceLang,
									  config.targetLang)));

		console.log("Translation", this.translatedWord)
		
	}

	translate(word, source, target){
		let api = new Request(config.googleApiUrl, "GET")
		let params = {
			"client":"gtx",
			"sl" : source,
			"tl" : target,
			"dt": "t",
			"q": word
		}

		api.appendAll(params)

		api.loadJson((data) =>{
			console.log("Google json", data)
		})
	}

	parse(json){
		return json[0][0][0];
	}

	getOriginal(){
		return this.extendedWord.original;
	}

	getTranslatedWord(){
		return this.translatedWord;
	}

	getAllTranslations(){ // Array<TranslatedWord>
		return new Array(this.translatedWord)
	}

}


class TranslationService{
	constructor (initialWord, sentence){
		this.initialWord = initialWord;
		this.sentence = sentence;
	}

	simpleTranslate(){
		return "*"+this.initialWord+"*"
	}

}
class PopupBuilder{

	createTranslationPopup(translationService){
		let popup = this.create("div", config.popupClass)

		//popup.textContent = word
		this.translationService = translationService;

		this.adjustStyle(popup)
		this.createCloseDiv(popup)
		this.createScrollBar(popup)
		this.createFooter(popup)

		document.body.appendChild(popup);
	}

	createCloseDiv(popup){
		let closeDiv = this.create("div", config.closePopupClass)
		closeDiv.addEventListener("click", (e) => this.removeTranslationPopup())
		popup.appendChild(closeDiv)
	}

	createScrollBar(popup){
		let scrollBar = this.create("div", config.translationScrollBarClass)

		scrollBar.style.height = pixel(config.scrollBarHeight)
		scrollBar.style.minWidth = pixel(config.popupWidth)

		this.createTranslationPanel(scrollBar);

		popup.appendChild(scrollBar)
	}

	createTranslationPanel(scrollBar){
		let translationPanel = this.create("div", config.translationPanelClass)

		let headerSection = this.create("div", config.headerSectionClass)	
		this.populateHeaderSection(headerSection);

		let fullSection = this.create("div", config.fullSectionClass)
		this.populateTranslations(fullSection)

		translationPanel.appendChild(headerSection)
		translationPanel.appendChild(fullSection)
		scrollBar.appendChild(translationPanel)
	}


	populateHeaderSection(headerSection){

		let header = this.create("div", config.headerClass)

		let wordSpan = document.createElement("span")
		wordSpan.style.color = "rgb(189, 189, 0)"
		wordSpan.style.fontWeight = "bold"
		wordSpan.textContent = this.translationService.initialWord;

		let translationSpan = document.createElement("span")
		translationSpan.textContent = this.translationService.simpleTranslate();

		header.appendChild(wordSpan)
		header.appendChild(document.createElement("br"))
		header.appendChild(translationSpan)

		headerSection.appendChild(header)

	}

	populateTranslations(full){
		let service = new GoogleService(new ExtendedWord(this.translationService.initialWord));
		//let wic = new WictionaryService(this.translationService.initialWord);

		console.log(service.getTranslatedWord())
		//console.log(wic.getExtendedWord())
	}

	createFooter(popup){
		let externalDicstRow = this.create("div", config.externalDictsClass)
		let externalContainer = this.create("span", config.externalDictsContainerClass)
		
		externalDicstRow.style.minWidth = pixel(config.popupWidth)
		externalContainer.textContent = "Re Po Gl" // TODO: for each translator each color

		externalDicstRow.appendChild(externalContainer)
		popup.appendChild(externalDicstRow)
	}



	adjustStyle(popup){
		popup.style.width = pixel(config.popupWidth);
		popup.style.left = pixel((maxWidth-config.popupWidth)/2)
		popup.style.top = pixel(config.popupTop);
	}

	
	removeTranslationPopup(){
		let popup = document.querySelector(toClass(config.popupClass))
		if (popup != null){
			popup.remove()
		}
		
	}

	activateTranslationPopup(){
		let popup = document.querySelector(toClass(config.popupClass))
		popup.style.visibility = 'visible'
		popup.style.opacity = config.activationOpacity
	}

	create(element, cl){
		let el = document.createElement(element)
		el.classList.add(cl);
		return el
	}
		
}


class Extension {
	constructor(builder){
		this.launched = false;
		this.builder = builder;
	}

	wordClicked(event, builder){
		console.log("Word is clicked", event.target, event.target.textContent)

		let service = new TranslationService(event.target.textContent)

		builder.removeTranslationPopup()
		builder.createTranslationPopup(service);
		builder.activateTranslationPopup()

	
	};

	wrapWordsWithSpans(span){
		if (span.id === config.wordEditedId) return false;

		span.id = config.wordEditedId
		span.innerHTML = "<br>"+replaceWithSpans(span.textContent, config.wordEditedId, config.hoverableWordClass);

		const wordHandlerReference = (event) => this.wordClicked(event, this.builder)
		span.querySelectorAll('span').forEach((word) => word.addEventListener('click', wordHandlerReference));
	}

	update(newItem){
		const wrapWordsWithSpansReference = (span) => this.wrapWordsWithSpans(span);

		this.launched = true;
		let wait = false;
		newItem.addEventListener("DOMNodeInserted", function (e) {
			if(wait){return false;}
			wait = true;
			setTimeout(function(){
				wait = false;
				try{ //TODO: may be add each word to sentece and to TranslatorService as well and only then wrap with spans
					newItem.querySelectorAll('span').forEach(wrapWordsWithSpansReference);		
				}catch(e){
					console.log(e)
					return false;
				}	
				
			},100)
		}, false);	
	}
}



function main(currentConfig){
	config = currentConfig;



	// Main extension with specified configuration
	let extension = new Extension(new PopupBuilder());

	setInterval(function(){

		let newItem = document.querySelector(textItemClass);
	
		if(newItem && document.querySelector(playerControlClass)){

			if(!extension.launched) extension.update(newItem);
	
		}else {
			extension.launched = false;	
		}
		
		
	},1000);
}


main(config_1);
