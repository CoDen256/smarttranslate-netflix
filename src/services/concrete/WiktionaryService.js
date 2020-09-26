import {Request} from '../../core/requests.js'
import {ExtendedWord, MeaningWord, Substantiv} from '../entities.js'
import {config} from '../../core/config.js'
import {WordMeaningService} from "../WordMeaningService.js";

const wiktionaryURL = "https://{SOURCE}.wiktionary.org/wiki/{QUERY}";
const wiktionaryApi = "https://{SOURCE}.wiktionary.org/w/index.php?action=raw&title={QUERY}";

const params = {source : config.sourceLang}

class WiktionaryService{ //TODO put extended word from outside

	constructor(extendedWord){
		this.service = new WordMeaningService(
			wiktionaryApi,
			params,
			extendedWord,
			this
		)
		this.parsed_gender = null;
	}


	normalize(raw) {return raw.text()}

	parse(normalized){ // => Array<String> - meanings
		return this.parseMeaning(normalized, 3)
	}

	getMeaningWord(){
		return this.service.getMeaningWord().then(meaningWord => this.applyGender(meaningWord));
	}

	parseByRegex(string, regex){
		if (!string.match(regex)) return false;
		let result = [...string.matchAll(regex)][0]
		return result.groups.result
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

		this.parsed_gender = this.parseGender(raw);
		return items
	}

	parseGender(raw){
		let gender = this.parseByRegex(raw, /{{Wortart\|Substantiv\|Deutsch}}, {{(?<result>\w)}}/g)
		if (!["f", "m", "n"].includes(gender)) return null;
		if (gender === false) return null;
		return gender
	}

	applyGender(meaningWord) {
		let pos = meaningWord.extendedWord.pos
		if (pos instanceof Substantiv) {
			pos.gender = this.parsed_gender
		}
		return meaningWord
	}
}

export {WiktionaryService, wiktionaryURL, params};