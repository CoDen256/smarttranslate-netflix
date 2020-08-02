import {Request} from '../core/requests.js'
import {TranslatedWord} from './entities.js'
import {config} from '../core/config.js'

//TODO: MAYBE USE THIS INSTEAD OF API TO 
const googleURL = "https://translate.google.com/?hl=de#view=home&op=translate&sl={SOURCE}&tl={TARGET}&text={QUERY}" 
const googleApiUrl = "https://translate.googleapis.com/translate_a/single";

class GoogleService {
	constructor(extendedWord){
		this.extendedWord = extendedWord;
		this.translatedWord = extendedWord.then((extWord) => new TranslatedWord(extWord))
										  .then((translated) => this.updateTranslated(translated))
	}

	getData(word){
		console.log(`Google is getting data for '${word}'`)
		let api = new Request(googleApiUrl, "GET")
		let params = {
			"client":"gtx",
			"sl" : config.sourceLang,
			"tl" : config.targetLang,
			"dt": "t",
			"q": word,
		}

		api.appendAll(params)

		return api.loadJson()
	}

	parseResult(data){
		return data[0][0][0];
	}

	updateTranslated(translatedWord){
		return this.getData(translatedWord.extendedWord.mainForm)
				.then((data) => this.parseResult(data))
				.then((result) => translatedWord.addTranslation(result));
	}

	getTranslatedWord(){
		return this.translatedWord;
	}
}

export {GoogleService, googleURL};