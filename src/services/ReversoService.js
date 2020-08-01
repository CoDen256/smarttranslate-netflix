import {Request} from '../core/requests.js'
import {ExtendedWord} from './entities.js'
import {config} from '../core/config.js'

const reversoUrl = "https://context.reverso.net/translation/{SOURCE}-{TARGET}/{QUERY}"
const reversoApi = reversoUrl

class ReversoService {
    constructor(extendedWord){
        console.log("Reverso Service created")
		this.extendedWord = extendedWord;
		this.original = extendedWord.original;
	}

	getData(){
        console.log(`Getting data for '${this.original}'`)
		let url = reversoApi.replace("{SOURCE}", config.sourceLangFull)
							.replace("{TARGET}", config.targetLangFull)
							.replace("{QUERY}", this.original)
		let api = new Request(url, "GET")

		return api.loadRaw() // DOM HTML or something
	}
}


export {ReversoService, reversoUrl}