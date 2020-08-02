import {Request} from '../core/requests.js'
import {TranslatedWord} from './entities.js'
import {config} from '../core/config.js'


class WordTranslationService {
	constructor(apiUrl, params, extendedWord, client){
        this.apiUrl = apiUrl;
        this.params = params;
        this.extendedWord = extendedWord;

        this.client = client

        if (!typeof client.normalize === 'function'){
            client.normalize = this.identity;
            console.log(`normalize() of ${client} is not specified`)
        }
        if (!typeof client.parse === 'function'){
            client.parse = this.identity;
            console.log(`parse() of ${client} is not specified`)
        }
        //client.normalize  // normalize(raw) => Any normalized
        //client.parse      // parse(Any normalized) => Array<String> - translations


		this.translatedWord = extendedWord.then((extWord) => new TranslatedWord(extWord))
                                          .then((translated) => this.updateTranslated(translated))
                                          .catch((error) => this.defaultValue(error))
	}

	getData(word){
        console.log(`Getting data for '${word}' from ${this.apiUrl}`)
        
        this.params.query = word;
        let api = new Request(this.apiUrl, this.params)

		return api.fetchData()
	}

	updateTranslated(translatedWord){
        return this.getData(translatedWord.extendedWord.mainForm) // ONLY FOR TRANSLATIONS mainForm
                    .then((raw) => this.client.normalize(raw))
				    .then((normalized) => this.client.parse(normalized))
				    .then((result) => translatedWord.addTranslations(result));
    }
    
    identity(income){
        return income
    }

    defaultValue(error){
		console.log("Error while creating Translated word beacause:\n", error)
		console.log("Default value will be returned by", this.client)
        return this.extendedWord.then((extWord) => new TranslatedWord(extWord))
    }

	getTranslatedWord(){
		return this.translatedWord;
	}
}

export {WordTranslationService};