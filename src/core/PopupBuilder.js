import {maxWidth, config} from './config.js'
import {pixel, toClass, create, select} from './Utils.js'
import {Translator} from "./Translator.js";
import {MultitranRenderer} from "./renderers/tab/multitran.js";
import {GoogleRenderer} from "./renderers/header/google.js";
import {PonsRenderer} from "./renderers/tab/pons.js";
import {ReversoRenderer} from "./renderers/tab/reverso.js";

class PopupBuilder{

	constructor(){
		this.applyEventListeners();
		window.reloadPopup = this.reload
		
	}
	createTranslationPopup(translator){
		this.translator = translator;
		this.rendererProvider = translator.getExtended().getHeaderRendererClass();
		let headerRenderer = new this.rendererProvider(translator, select(".translation-header"));
		this.removeTranslationPopup()
		this.showTranslationPopup()

		// rendering all the stuff
		GoogleRenderer.render(translator) // the simple translation from google
		headerRenderer.render()
		this.fillTabs();
		this.activate("#tab-reverso", select("#button-reverso"))
	}

	reload(extended) {
		let popup = new PopupBuilder()
		popup.createTranslationPopup(new Translator(extended))
	}


	applyEventListeners(){
		select(".close-popup").addEventListener("click", (e) => this.removeTranslationPopup())
		let map = {
			"#button-multi" : "#tab-multitran",
			"#button-pons" : "#tab-pons",
			"#button-reverso" : "#tab-reverso",
			"#button-glosbe" : "#tab-glosbe",
			"#button-duden" : "#tab-duden",
			"#button-wik" : "#tab-wik",
		}
		for (const [key, value] of Object.entries(map)) {
			select(key).addEventListener("click", e => this.activate(value, e.target))
		}
		
	}


	activate(id, button){
		document.querySelectorAll(".section-full").forEach(e => e.style.display="none")
		select(id).style.display = "block"

		document.querySelector(".tabs-row").querySelectorAll("button").forEach(b => {
			b.className = ""
		})
		button.className ="active"
	}


	fillTabs(){
		// MultitranRenderer.render(this.translator);
		PonsRenderer.render(this.translator)
		// ReversoRenderer.render(this.translator)
		this.fillGlosbe()
		this.fillDuden()
		this.fillWiktionary()
	}


	fillGlosbe(){
		select("#tab-glosbe").querySelector("a").href = "glosbe.com"
	}

	fillDuden(){
		select("#tab-duden").querySelector("a").href = "duden.de"
	}

	fillWiktionary(){
		select("#tab-wik").querySelector("a").href = "wiktionary.org"
	}

	
	removeTranslationPopup(){
		console.log("Hiding Translation Popup")
		select(".translation-popup").style.visibility = 'hidden';
		this.rendererProvider.disableExtra()
	}

	showTranslationPopup(){
		console.log("Showing Translation Popup")

		select(".translation-popup").style.visibility = 'visible';
		this.rendererProvider.enableExtra()
	}
		
}

export {PopupBuilder};