import {Request} from '../core/requests.js'
import {ExtendedWord} from './entities.js'
import {config} from '../core/config.js'

const multitranUrl = "https://www.multitran.com/m.exe?l1={SOURCE}&l2={TARGET}&s={QUERY}"
const multitranApi = "https://www.multitran.com/m.exe"
const langMap = {"de" : "3", "ru":"2", "en":"1"}

class MultitranService {
    constructor(extendedWord){
        console.log("Multitran Service created")
		this.extendedWord = extendedWord;
		this.mainForm = extendedWord.mainForm;
	}

	getData(){
        console.log(`Getting data for '${this.mainForm}'`)
        let api = new Request(multitranApi, "GET")
        
        let params = {
            "l1":langMap[config.sourceLang],
            "l2":langMap[config.targetLang],
            "s": this.mainForm
        }

        api.appendAll(params)


		return api.loadRaw() // DOM HTML or something
	}

}

export {MultitranService, multitranUrl, langMap}