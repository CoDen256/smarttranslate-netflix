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
	    let extended = contextWord.extendedWord
        return extended.prepareToContext(extended.mainForm)
    }

    onResult(contextWord, result){
        return contextWord.addContexts(result)
    }
}

export {WordContextService};