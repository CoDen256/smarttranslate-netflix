import { WordMeaningService } from '../WordMeaningService.js';
import { ExtendedWord } from '../entities.js';

const dudenUrl = "https://www.duden.de/rechtschreibung/{QUERY}"
const dudenApi = dudenUrl;

const params = {}

class DudenService { 
    constructor(extendedWord){
		extendedWord = extendedWord.then((word) => {
			let newWord = word.clone()
			newWord.mainForm = newWord.mainForm
										 .replace("ü", "ue")
										 .replace("ä", "ae")
										 .replace("ö", "oe")
										 .replace("ß", "sz")
			return newWord
		})
		this.service = new WordMeaningService(
			dudenApi,
			params,
			extendedWord,
			this
		)
	}

	normalize(raw) {return raw.text()}

	parse(normalized){ // => Array<String> - meanings
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

export {DudenService, dudenUrl}