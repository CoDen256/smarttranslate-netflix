import { WordMeaningService } from '../WordMeaningService.js';
import { ExtendedWord } from '../entities.js';

const dudenUrl = "https://www.duden.de/rechtschreibung/{QUERY}"
const dudenApi = dudenUrl;

const params = {}

class DudenService { 
    constructor(extendedWord){
		this.service = new WordMeaningService(
			dudenApi,
			params,
			extendedWord,
			this
		)
	}

	prepare(word) {
    	return word
			.replace("ü", "ue")
			.replace("ä", "ae")
			.replace("ö", "oe")
			.replace("ß", "sz")
	}

	normalize(raw) {return raw.text()}

	parse(normalized){ // => Array<String> - meanings
    	// TODO sometimes not parsing meanings (e.g for Pizza)
        let doc = new DOMParser().parseFromString(normalized, 'text/html')
        let meanings = []
        doc.querySelectorAll(".enumeration__text").forEach((enumText) => {
            meanings.push(enumText.textContent)
        })
        return meanings;
	}

	getMeaningWord(){
		return this.service.getMeaningWord();
	}


}

export {DudenService, dudenUrl, params}