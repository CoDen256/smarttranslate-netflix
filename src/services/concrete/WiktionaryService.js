import {Request} from '../../core/requests.js'
import {ExtendedWord, MeaningWord} from '../entities.js'
import {config} from '../../core/config.js'

const wiktionaryURL = "https://{SOURCE}.wiktionary.org/wiki/{QUERY}";
const wiktionaryApi = "https://{SOURCE}.wiktionary.org/w/index.php?action=raw&title={QUERY}";

class WiktionaryService{ //TODO put extended word from outside

	constructor(originalWord){
		this.originalWord = originalWord

		this.meainingWord = this.getData(originalWord).then((data) => this.initializeMeaningWord(data))
													  .catch(e => this.defaultValue(e))
	}

	getMeaningWord(){
		return this.meainingWord;
	}


	getData(word){
		console.log(`Wiktionart is getting data for '${word}'`)
		let api = new Request(wiktionaryApi, {
			query:word,
			source:config.sourceLang
		})

		return api.fetchData().then((data) => data.text())
	}

	/** 
	 * Returns ExtendedWord wrapped by MeaningWord
	 */
	initializeMeaningWord(data){ 
		let mainForm = this.parseMainForm(data)

		if (mainForm !== "FAILED_MAINFORM"){ // MAIN_FORM exsited, thus not main form
			return this.getData(mainForm).then((data) => this.initializeMeaningWord(data))
		}

		let type = this.parseWordType(data)
		if (type === "FAILED_WORDTYPE") throw "Can't parse word"

		let extendedWord = new ExtendedWord(this.originalWord);
		extendedWord.type = type
		extendedWord.mainForm = this.getTitle(data);

		if (extendedWord.type === "Substantiv"){
			extendedWord.gender = this.parseGender(data)
		}


		let meaningWord = new MeaningWord(extendedWord);
		meaningWord.addMeanings(this.parseMeaning(data, 3));
		return meaningWord;
	}

	defaultValue(error){
		console.log("Error while creating Meaning word beacause:\n", error)
		console.log("Default value will be returned by", this)
		return new MeaningWord(new ExtendedWord(this.originalWord));
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

	getTitle(raw) {
		let title = this.parseByRegex(raw, /== (?<result>[A-Za-zäöüß]+) \({{Sprache\|Deutsch}}\) ==/g)
		if (title == false) throw "UNABLE TO PARSE TITLE"
		return title
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

	parseGender(raw){
		let gender = this.parseByRegex(raw, /{{Wortart\|Substantiv\|Deutsch}}, {{(?<result>\w)}}/g)
		if (gender == false) return null;
		return gender
	}

}

export {WiktionaryService, wiktionaryURL};