import {maxWidth, config} from './config.js'
import {pixel, toClass} from './Utils.js'
class PopupBuilder{

	createTranslationPopup(translator){
		let popup = this.create("div", config.popupClass)

		//popup.textContent = word
		this.translator = translator;

		this.adjustStyle(popup)
		this.createCloseDiv(popup)
		this.createScrollBar(popup) // TODO: Create tabs for  each one;s
		this.createFooter(popup) 

		// TODO: while loading just initialy let it display something like "loading", and then it will be replaced

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

export {PopupBuilder};