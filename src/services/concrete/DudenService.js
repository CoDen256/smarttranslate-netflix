import { WordMeaningService } from '../WordMeaningService.js';

const dudenUrl = "https://www.duden.de/rechtschreibung/{QUERY}"
const dudenApi = dudenUrl;

const params = {}

class DudenService { 
    constructor(extendedWord){
		console.log("Extended:", extendedWord)
		this.service = new WordMeaningService(
			dudenApi,
			params,
			extendedWord,
			this
		)
	}

	normalize(raw) {
		return raw.text()
	}

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