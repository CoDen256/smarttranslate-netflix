import {AbstractService} from './AbstractService.js'
import {ContextWord} from './entities.js'

class WordContextService {
	constructor(apiUrl, params, extendedWord, client){
        this.abstractService = new AbstractService(
            apiUrl,
            params,
            extendedWord,
            client,
            this
        )
	}

	getContextWord(){
		return this.abstractService.getWord();
    }
    
    toSpecifiedWord(extendedWord){
        return new ContextWord(extendedWord)
    }

    mapToString(contextWord){
        return contextWord.extendedWord.original
    }

    onResult(contextWord, result){
        return contextWord.addContexts(result)
    }
}

export {WordContextService};