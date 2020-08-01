import {Request} from '../core/requests.js'
import {ExtendedWord} from './entities.js'

const wiktionaryURL = "https://{SOURCE}.wiktionary.org/wiki/{QUERY}";
const wiktionaryApi = "https://de.wiktionary.org/w/index.php";

class WiktionaryService{

	constructor(originalWord){
		console.log("Wiktionary Service created")
		this.originalWord = originalWord
		this.extendedWord = new ExtendedWord(originalWord);
		//this.initialize(originalWord);
	}


	getData(){
		console.log(`Getting data for '${this.originalWord}'`)
		let api = new Request(wiktionaryApi, "GET")
		let params = {
			"title" : this.originalWord,
			"action" : "raw",
		}

		api.appendAll(params)

		return api.loadRaw()
	}

	initialize(){
		let data = this.getData();
		return
		let type = this.parseWordType(data)

		let mainForm = originalWord;

		if (type.includes("Form")){ // TODO: need to now all wortarts {PARTIZIP Erweiterter Infinitiv etc..}
			mainForm = this.parseMainForm(data);
			data = this.getData(mainForm) //TODO: somehow rearrange code, dirty functions
			type = this.parseWordType(data)
		}

		this.extendedWord.type = type;
		this.extendedWord.mainForm = mainForm;
		this.extendedWord.meaning = this.parseMeaning(data)
	}


	parseByRegex(string, regex){
		if (!string.match(regex)) return false;
		let result = [...string.matchAll(regex)][0]
		return result.groups.result
	}


	parseWordType(raw){
		let type = this.parseByRegex(raw, /{{Wortart\|(?<result>.+)\|Deutsch}}/g);
		if (type == false) return "FAILED_WORDTYPE"
		console.log("Type Of word", type)
		return type;
		
	}

	parseMainForm(raw){
		let main = this.parseByRegex(raw, /{{Grundformverweis.+\|(?<result>.+)\}}/g);
		if (main == false) return "FAILED_MAINFORM"
		console.log("Main Form of word", main)
		return main;

	}

	parseMeaning(raw){
		let regex = /{{Bedeutungen}}(\n|.)*/g // to cut meaining 
		let regex2 = /:\[(\d|\w)\](?<result>.*)\n/g // parse all rows
		if (!raw.match(regex)) return null
		let meaningData = raw.match(regex)[0]

		let results = [...meaningData.matchAll(regex2)].slice(0,3)
		let items = [];
		results.forEach(g => {
			let item = g.groups.result.replace(/(\[|\]|{.*})/g, "")
			console.log("Item of meaning", item.toString());
			items.push(item)
		})
		return items
	}

	getExtendedWord(){
		return this.extendedWord;
	}
}

export {WiktionaryService, wiktionaryURL};