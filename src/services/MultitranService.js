import {WordTranslationService} from './WordTranslationService.js'
import {config} from '../core/config.js'

const multitranUrl = "https://www.multitran.com/m.exe?l1={SOURCE}&l2={TARGET}&s={QUERY}"
const multitranApi = multitranUrl
const langMap = {"de" : "3", "ru":"2", "en":"1"}

const params = {
    source: langMap[config.sourceLang],
    target: langMap[config.targetLang]
}
//TODO: different translations je nach WortArt
class MultitranService {
    constructor(extendedWord){
		this.service = new WordTranslationService(
			multitranApi,
			params,
			extendedWord,
			this
		)
	}

	normalize(raw) {
		return raw.text()
	}

	parse(normalized){ // Array<String> - translations
        let doc = new DOMParser().parseFromString(normalized, 'text/html')
        let translations = []
        doc.querySelectorAll(".trans").forEach((cl) => {
            cl.querySelectorAll("a").forEach(a => {
                if (a.parentNode.nodeName === "TD") {
                    translations.push(a.textContent)
                }
            })
            
        })
        return translations;
	}

	getTranslatedWord(){
		return this.service.translatedWord;
	}

}

export {MultitranService, multitranUrl, langMap}