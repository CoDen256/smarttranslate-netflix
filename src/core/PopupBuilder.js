import {maxWidth, config} from './config.js'
import {pixel, toClass} from './Utils.js'
class PopupBuilder{

	constructor(){
		this.applyEventListeners();
		
	}
	createTranslationPopup(translator){ //TODO: Checkbox near verb, if it is reflexiv, so user decides
		this.translator = translator;
		this.removeTranslationPopup()
		this.showTranslationPopup()
		this.fillHeaderSection()
		this.fillTabs();
		this.activate("#tab-multitran", this.select("#button-multi"))

		// TODO: while loading just initialy let it display something like "loading", and then it will be replaced

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


	fillHeaderSection(){
		this.select("#title").textContent = this.translator.lemma.render();

		let infoSpan = this.select("#translation-info")

		this.translator.getInfo().then((info) => {
			infoSpan.textContent = "   "+info;	//TODO: der/die/das
		})

		let translationSpan = this.select("#short-translation")


		this.translator.simpleTranslate().then((translation) => {
			translationSpan.textContent = translation;
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
	}

	showTranslationPopup(){
		console.log("Showing Translation Popup")
		this.select(".translation-popup").style.visibility = 'visible';
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