import {Request} from '../../core/requests.js'
import {ExtendedWord, PoS, Verb, Substantiv} from '../entities.js'
import {config} from '../../core/config.js'

const lemmatizerAPI = "http://netflixenhancedlanguagestorage.pythonanywhere.com/lemmatizer/?{QUERY}";

let grundWords = ["müssen", "sollen", "können", "dürfen", "sein", "haben", "werden", "wollen"]

// Simple Tags:
const ADJ = "adjektiv"
const ADV = "adverb"
const VER = "verb"
const SUB = "substantiv"
const IGN = "ignore" // determiter, particles, numbers etc


// APPO zufolge
//
class Lemmatizer { 

	constructor(sentence){
		this.sentence = sentence
		this.lemmas = this.getData(sentence)
					  .then((data) => this.lemmatize(data))
					  .catch(e => this.defaultValue(e))
	}



	getData(sentence){
		console.log(`LEMMATIZER is getting data for '${sentence}'`)
		let api = new Request(lemmatizerAPI, {
			query:sentence,
		})
		return api.fetchData().then((data) => data.json())
	}


	lemmatize(jsonData){
		console.log("JSON DATA", jsonData)
		let lemmas = []
		let lastVerb = null
		let lastRefl = null
		let lastPrefix = null

		for (let lemma of jsonData){
			let orig = lemma["orig"];
			let main = lemma["main"];
			let type = lemma["type"];

			if (main === "--") {
				this.update(lastVerb, lastPrefix, lastRefl)
				lastVerb = null;
				lastPrefix = null;
				lastRefl = null;
				continue;
			}

			let extendedWord = new ExtendedWord(orig);
			extendedWord.mainForm = main;
			extendedWord.extendedType = IGN; // by default
			let pos = null;

			if (this.isAdj(type)){
				extendedWord.extendedType = ADJ;
				pos = this.parseAdjektiv(extendedWord, type)

			}else if (this.isAdv(type)){
				extendedWord.extendedType = ADV;
				pos = this.parseAdverb(extendedWord, type)

			}else if (this.isVerb(type)){
				extendedWord.extendedType = VER
				pos = this.parseVerb(extendedWord, type)
				if (!grundWords.includes(pos.extendedWord.mainForm)){
					lastVerb = pos;
				}

			}else if (this.isSub(type)){
				extendedWord.extendedType = SUB
				pos = this.parseSub(extendedWord, type)

			}else if (this.isRefl(type)){
				pos = this.parseReflexive(extendedWord, type)
				lastRefl = pos;

			}else if (this.isPrefix(type)){
				pos = this.parsePrefix(extendedWord, type)
				lastPrefix = pos;

			}else{
				pos = this.parseDefault(extendedWord, type)

			}
			lemmas.push(pos)

		}
		this.update(lastVerb, lastPrefix, lastRefl)

		return lemmas
	}

	parseVerb(extendedWord, type){
		return new Verb(extendedWord, null, null, type);
	}

	
	parseSub(extendedWord, type){
		return new Substantiv(extendedWord, null, type)
	}

	parseDefault(extendedWord, type){
		return new PoS(extendedWord, type)
	}

	parseAdjektiv(extendedWord, type){
		return this.parseDefault(extendedWord, type)
	}

	parseAdverb(extendedWord, type){
		return this.parseDefault(extendedWord, type)
	}

	parseReflexive(extendedWord, type){
		return this.parseDefault(extendedWord, type)
	}

	parsePrefix(extendedWord, type){
		return this.parseDefault(extendedWord, type)
	}

	update(verb, prefix, refl){
		if (verb == null) return
		verb.prefix = ""

		if (prefix != null){
			verb.prefix = prefix.extendedWord.mainForm;
		}
		if (refl != null){
			verb.reflex = true;
		}
		
	}

	isVerb(l){return l.startsWith("V")}
	isAdj(l){return l.startsWith("ADJ")}
	isAdv(l){return l.startsWith("ADV")}
	isSub(l){return l.startsWith("N")}
	isRefl(l){return l.startsWith("PRF")}
	isPrefix(l){return l.startsWith("PTKVZ")}

	getLemmas(){ // Array<Word(ext)>
		return this.lemmas;
	}

	defaultValue(error){
		console.log("FATAL ERROR IN LEMMATIZER:", error);
		let defaultValue = this.sentence.split(/\W/g).filter(w => w).map(word => {
			return new PoS(new ExtendedWord(word), null)
		})
		console.log("Returning:\n", defaultValue)
		return defaultValue
	}

}

export {Lemmatizer};