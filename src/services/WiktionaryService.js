import {Request} from '../core/requests.js'
import {ExtendedWord, MeaningWord} from './entities.js'

const wiktionaryURL = "https://{SOURCE}.wiktionary.org/wiki/{QUERY}";
const wiktionaryApi = "https://de.wiktionary.org/w/index.php";

class WiktionaryService{

	constructor(originalWord){
		this.originalWord = originalWord

		this.meainingWord = this.getData(originalWord).then((data) => this.initializeMeaningWord(data));
	}

	getMeaningWord(){
		return this.meainingWord;
	}


	getData(word){
		console.log(`Wiktionart is getting data for '${word}'`)
		let api = new Request(wiktionaryApi)
		let params = {
			"title" : word,
			"action" : "raw",
		}

		api.appendAll(params)

		return api.loadRaw().then((data) => data.text())
	}

	/** 
	 * Returns ExtendedWord wrapped by MeaningWord
	 */
	initializeMeaningWord(data){ 
		let mainForm = this.parseMainForm(data)

		if (mainForm !== "FAILED_MAINFORM"){ // MAIN_FORM exsited, thus not main form
			return this.getData(mainForm).then((data) => this.initializeMeaningWord(data))
		}

		let extendedWord = new ExtendedWord(this.originalWord);
		extendedWord.mainForm = this.getTitle(data);
		extendedWord.type = this.parseWordType(data)

		let meaningWord = new MeaningWord(extendedWord);
		meaningWord.addMeanings(this.parseMeaning(data, 3));
		return meaningWord;
	}



	parseByRegex(string, regex){
		if (!string.match(regex)) return false;
		let result = [...string.matchAll(regex)][0]
		return result.groups.result
	}


	parseWordType(raw){
		let type = this.parseByRegex(raw, /{{Wortart\|(?<result>.+)\|Deutsch}}/g);
		if (type == false) return "FAILED_WORDTYPE"
		console.log("Type Of word:", type)
		return type;
		
	}

	parseMainForm(raw){
		let main = this.parseByRegex(raw, /{{Grundformverweis.+\|(?<result>.+)\}}/g);
		if (main == false) return "FAILED_MAINFORM"
		console.log("Main Form of word:", main)
		return main;

	}

	getTitle(data) {
		return data.split(" ")[1];
	}

	parseMeaning(raw, lines){
		let regex = /{{Bedeutungen}}(\n|.)*/g // to cut meaining 
		let regex2 = /:\[(\d|\w)\](?<result>.*)\n/g // parse all rows
		if (!raw.match(regex)) return null
		let meaningData = raw.match(regex)[0]

		let results = [...meaningData.matchAll(regex2)].slice(0,lines)
		let items = [];
		results.forEach(g => {
			let item = g.groups.result.replace(/(\[|\]|{.*})/g, "")
			//console.log("Item of meaning", item.toString());
			items.push(item.trim())
		})
		return items
	}

}

export {WiktionaryService, wiktionaryURL};