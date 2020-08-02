import {Request} from '../../core/requests.js'

const lingueeUrl = "https://www.linguee.de/deutsch-englisch/search?source=auto&query={QUERY}"
const lingueeApi = lingueeUrl;

class LingueeService {
    constructor(extendedWord){
        console.log("Linguee Service created")
		this.extendedWord = extendedWord;
		this.original = extendedWord.original;
	}

	getData(){
        console.log(`Getting data for '${this.original}'`)
		let url = lingueeApi.replace("{QUERY}", this.original)
		let api = new Request(url, "GET")

		return api.loadRaw() // DOM HTML or something
	}

}

export {LingueeService, lingueeUrl}