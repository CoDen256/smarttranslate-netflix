import {Request} from '../core/requests.js'
import {ExtendedWord} from './entities.js'
import {config} from '../core/config.js'

const ponsUrl = "https://en.pons.com/translate/{SOURCE_FULL}-{TARGET_FULL}/{QUERY}"
const ponsApi = ponsUrl

class PonsService {
    constructor(extendedWord){
        console.log("Pons Service created")
		this.extendedWord = extendedWord;
		this.mainForm = extendedWord.mainForm;
	}

	getData(){
        console.log(`Getting data for '${this.mainForm}'`)
        let api = new Request(ponsApi.replace("{SOURCE_FULL}", config.sourceLangFull)
                                      .replace("{TARGET_FULL}", config.targetLangFull)
                                      .replace("{QUERY}", this.mainForm),
                                      "GET")

		return api.loadRaw() // DOM HTML or something
	}

}

export {PonsService, ponsUrl}