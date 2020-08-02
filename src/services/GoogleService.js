import {Request} from '../core/requests.js'
import {TranslatedWord} from './entities.js'
import {config} from '../core/config.js'
import {WordTranslationService} from './WordTranslationService.js'

//TODO: MAYBE USE THIS INSTEAD OF API TOO
const googleURL = "https://translate.google.com/?hl=de#view=home&op=translate&sl={SOURCE}&tl={TARGET}&text={QUERY}" 
const googleApiUrl = "https://translate.googleapis.com/translate_a/single?client=gtx&sl={SOURCE}&tl={TARGET}&dt=t&q={QUERY}";

const params = {
	source : config.sourceLang,
	target : config.targetLang,
}

class GoogleService {
	constructor(extendedWord){
		this.service = new WordTranslationService(
			googleApiUrl,
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

export {GoogleService, googleURL};