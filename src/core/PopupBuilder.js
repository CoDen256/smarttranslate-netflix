import {maxWidth, config} from './config.js'
import {pixel, toClass} from './Utils.js'
import {Translator} from "./Translator.js";
class PopupBuilder{

	constructor(){
		this.applyEventListeners();
		window.reloadPopup = this.reload
		
	}
	createTranslationPopup(translator){
		this.translator = translator;
		this.rendererProvider = translator.getExtended().getHeaderRendererClass();
		let renderer = new this.rendererProvider(translator, this.select(".translation-header"));
		this.removeTranslationPopup()
		this.showTranslationPopup()

		// rendering all the stuff
		this.addSimpleTranslation()
		renderer.render()
		this.fillTabs();
		this.activate("#tab-multitran", this.select("#button-multi"))
	}

	reload(extended) {
		let popup = new PopupBuilder()
		popup.createTranslationPopup(new Translator(extended))
	}


	applyEventListeners(){
		this.select(".close-popup").addEventListener("click", (e) => this.removeTranslationPopup())
		let map = {
			"#button-multi" : "#tab-multitran",
			"#button-pons" : "#tab-pons",
			"#button-reverso" : "#tab-reverso",
			"#button-glosbe" : "#tab-glosbe",
			"#button-duden" : "#tab-duden",
			"#button-wik" : "#tab-wik",
		}
		for (const [key, value] of Object.entries(map)) {
			this.select(key).addEventListener("click", e => this.activate(value, e.target))
		}
		
	}


	activate(id, button){
		document.querySelectorAll(".section-full").forEach(e => e.style.display="none")
		this.select(id).style.display = "block"

		document.querySelector(".tabs-row").querySelectorAll("button").forEach(b => {
			b.className = ""
		})
		button.className ="active"
	}


	addSimpleTranslation(){
		let short_translation = this.select("#short-translation")
		short_translation.textContent = "[loading]"
		short_translation.style.color = "white"
		short_translation.style.fontWeight = "normal"

		this.translator.simpleTranslate().then(translate => {
			short_translation.textContent = translate
			short_translation.style.color = "yellow"
			short_translation.style.fontWeight = "bold"
		})
	}

	fillTabs(){
		this.fillMultitran()
		this.fillPons()
		this.fillReverso()
		this.fillGlosbe()
		this.fillDuden()
		this.fillWiktionary()
	}

	fillMultitran(){
		this.select("#tab-multitran").querySelector("a").href = "https://www.multitran.com/"
		
		let content = this.select(".dictionary-content")
		content.innerHTML = ""
		this.translator.getMultitranTranslations().then((translations) => {
			translations.forEach((t) => {
				// <li class="dictionary-content-item">
				let item = this.create("li", "dictionary-content-item")
				item.textContent = t;
				content.appendChild(item)
			})
		})
	}

	fillPons(){
		this.select("#tab-pons").querySelector("a").href = "pons.com"
	}

	fillReverso(){
		this.select("#tab-reverso").querySelector("a").href = "context.reverso.net"
	}

	fillGlosbe(){
		this.select("#tab-glosbe").querySelector("a").href = "glosbe.com"
	}

	fillDuden(){
		this.select("#tab-duden").querySelector("a").href = "duden.de"
	}

	fillWiktionary(){
		this.select("#tab-wik").querySelector("a").href = "wiktionary.org"
	}

	
	removeTranslationPopup(){
		console.log("Hiding Translation Popup")
		this.select(".translation-popup").style.visibility = 'hidden';
		this.rendererProvider.disableExtra()
	}

	showTranslationPopup(){
		console.log("Showing Translation Popup")
		this.select(".translation-popup").style.visibility = 'visible';
		this.rendererProvider.enableExtra()
	}


	select(query){
		return document.querySelector(query)
	}

	create(element, cl){
		let el = document.createElement(element)
		el.classList.add(cl);
		return el
	}
		
}

export {PopupBuilder};