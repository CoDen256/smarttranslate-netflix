import {Request} from '../core/requests.js'
import {ExtendedWord} from './entities.js'
import {config} from '../core/config.js'

const multitranUrl = "https://www.multitran.com/m.exe?l1={SOURCE}&l2={TARGET}&s={QUERY}"
const multitranApi = multitranUrl
const langMap = {"de" : "3", "ru":"2", "en":"1"}

const params = {
    source: langMap[config.sourceLang],
    target: langMap[config.targetLang]
}

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
		return raw.json()
	}

	parse(normalized){
		return [normalized[0][0][0]];
	}

	getTranslatedWord(){
		return this.service.translatedWord;
	}

}

export {MultitranService, multitranUrl, langMap}