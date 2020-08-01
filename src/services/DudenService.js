import {Request} from '../core/requests.js'
import {ExtendedWord} from './entities.js'
import {config} from '../core/config.js'

const dudenUrl = "https://www.duden.de/rechtschreibung/{QUERY}"
const dudenApi = dudenUrl;

class DudenService {
    constructor(extendedWord){
        console.log("Duden Service created")
		this.extendedWord = extendedWord;
		this.mainForm = extendedWord.mainForm;
	}

	getData(){
        console.log(`Getting data for '${this.original}'`)
		let url = dudenApi.replace("{QUERY}", this.mainForm)
		let api = new Request(url, "GET")

		return api.loadRaw() // DOM HTML or something
	}

}

export {DudenService, dudenUrl}