import {Request} from '../core/requests.js'
import {ExtendedWord} from './entities.js'
import {config} from '../core/config.js'

const glosbeUrl = "https://{SOURCE}.glosbe.com/{SOURCE}/{TARGET}/{QUERY}"
const glosbeApi = glosbeUrl;

class GlosbeService {
    constructor(extendedWord){
        console.log("Glosbe Service created")
		this.extendedWord = extendedWord;
		this.original = extendedWord.original;
	}

	getData(){
        console.log(`Getting data for '${this.original}'`)
		let url = glosbeApi.replace(new RegExp("{SOURCE}","g"), config.sourceLang)
                          .replace("{TARGET}", config.targetLang)
                          .replace("{QUERY}", this.original)
		let api = new Request(url, "GET")

		return api.loadRaw() // DOM HTML or something
	}

}

export {GlosbeService, glosbeUrl}