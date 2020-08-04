import {maxWidth, config} from './config.js'
import {pixel, toClass} from './Utils.js'
class PopupBuilder{

	createTranslationPopup(translator){
		//this.translator = translator;

		this.removeTranslationPopup()
		this.showTranslationPopup()

		this.createCloseDiv()
		//this.fillHeaderSection()


		this.createFooter() 

		// TODO: while loading just initialy let it display something like "loading", and then it will be replaced

	}

	createCloseDiv(){
		this.select(".close-popup").addEventListener("click", (e) => this.hideTranslationPopup())
	}



	fillHeaderSection(){
		this.select("#title").textContent = this.translator.original; 

		let infoSpan = this.select("#translation-info")

		this.translator.getInfo().then((info) => {
			infoSpan.textContent = "   "+info;	//TODO: der/die/das
		})

		let translationSpan = this.select("#short-translation")


		this.translator.simpleTranslate().then((translation) => {
			translationSpan.textContent = translation;
		})

	}


	populateMainPage(full){
		let tabList = document.createElement("ul")
		tabList.className = config.tabListClass;

		let multitran = this.createMultitran(full);
		//let reverso = this.createReverso(full)

		tabList.appendChild(multitran);
		//tabList.appendChild(reverso);
		full.appendChild(tabList)
	}


	createDictionarySection(titleName, getContent){
		let dictionary = document.createElement("li")
		dictionary.className = config.dictionaryItem;

		let title = document.createElement("div")
		title.className = config.dictionaryTitle

		title.textContent = titleName

		let content = document.createElement("ol")
		content.className = config.dictionaryContent;


		let createItem = (parent, text) => {
			let item = document.createElement("li")
			item.className = config.dictionaryContentItem;
			item.textContent = text;
			parent.appendChild(item)
		}

		getContent.then((arr) => {
			arr.forEach((translation) => createItem(content, translation))
		})

	
		dictionary.appendChild(title)
		dictionary.appendChild(content)
		return dictionary;
	}

	createFooter(popup){
		this.select(".external-dicts-container").textContent = "Re Po Gl" 
		// TODO: for each translator each color	
	}

	
	removeTranslationPopup(){
		console.log("hiding")
		this.select(".translation-popup").style.visibility = 'hidden';
	}

	showTranslationPopup(){
		console.log("showing")
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