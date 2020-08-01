import {Request} from '../core/requests.js'
import {TranslatedWord} from './entities.js'
import {config} from '../core/config.js'

//TODO: MAYBE USE THIS INSTEAD OF API TO 
const googleURL = "https://translate.google.com/?hl=de#view=home&op=translate&sl={SOURCE}&tl={TARGET}&text={QUERY}" 
const googleApiUrl = "https://translate.googleapis.com/translate_a/single";

class GoogleService {
	constructor(extendedWord){
		console.log("Google Service created")
		this.extendedWord = extendedWord;
		this.wordMainForm = extendedWord.mainForm;
		/* 
		this.translatedWord = new TranslatedWord(
			this.extendedWord,
			this.parse(this.translate(extendedWord.mainForm, 
									  config.sourceLang,
									  config.targetLang)));
*/	
	}

	getData(){
		console.log(`Getting data for '${this.wordMainForm}'`)
		let api = new Request(googleApiUrl, "GET")
		let params = {
			"client":"gtx",
			"sl" : config.sourceLang,
			"tl" : config.targetLang,
			"dt": "t",
			"q": this.wordMainForm,
		}

		api.appendAll(params)

		return api.loadJson()
	}

	parse(json){
		return json[0][0][0];
	}

	getOriginal(){
		return this.extendedWord.original;
	}

	getTranslatedWord(){
		return this.translatedWord;
	}

	getAllTranslations(){ // Array<TranslatedWord>
		return new Array(this.translatedWord)
	}

}

export {GoogleService, googleURL};