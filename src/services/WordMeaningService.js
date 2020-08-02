import {AbstractService} from './AbstractService.js'
import {MeaningWord} from './entities.js'

class WordMeaningService {
	constructor(apiUrl, params, extendedWord, client){
        this.abstractService = new AbstractService(
            apiUrl,
            params,
            extendedWord,
            client,
            this
        )
	}

	getMeaningWord(){
		return this.abstractService.getWord();
    }
    
    toSpecifiedWord(extendedWord){
        return new MeaningWord(extendedWord)
    }

    mapToString(meaningWord){
        return meaningWord.extendedWord.mainForm
    }

    onResult(meaningWord, result){
        return meaningWord.addMeanings(result)
    }
}

export {WordMeaningService};