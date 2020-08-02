import {Request} from '../core/requests.js'
import {ExtendedWord} from './entities.js'
import {config} from '../core/config.js'

const ponsUrl = "https://en.pons.com/translate/{SOURCE_FULL}-{TARGET_FULL}/{QUERY}"
const ponsApi = ponsUrl
const params = {
    sourceFull: config.sourceLangFull,
    targetFull: config.targetLangFull,
}

class PonsService {
    constructor(extendedWord){
		this.service = new WordTranslationService(
			ponsApi,
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

export {PonsService, ponsUrl}