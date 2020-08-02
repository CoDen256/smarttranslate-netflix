import {AbstractService} from './AbstractService.js'
import {TranslatedWord} from './entities.js'

class WordTranslationService {
	constructor(apiUrl, params, extendedWord, client){
        this.abstractService = new AbstractService(
            apiUrl,
            params,
            extendedWord,
            client,
            this
        )
	}

	getTranslatedWord(){
		return this.abstractService.getWord();
    }
    
    toSpecifiedWord(extendedWord){
        return new TranslatedWord(extendedWord)
    }

    mapToString(translatedWord){
        return translatedWord.extendedWord.mainForm
    }

    onResult(translatedWord, result){
        return translatedWord.addTranslation(result)
    }
}

export {WordTranslationService};