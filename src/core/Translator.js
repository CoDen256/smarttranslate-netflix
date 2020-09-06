import {WiktionaryService} from '../services/concrete/WiktionaryService.js'
import {GoogleService} from '../services/concrete/GoogleService.js'
import {ReversoService} from '../services/concrete/ReversoService.js'
import {MultitranService} from '../services/concrete/MultitranService.js'
import {DudenService } from '../services/concrete/DudenService.js';
import {GlosbeService} from '../services/concrete/GlosbeService.js';
import {PonsService} from '../services/concrete/PonsService.js'

class Translator{
	constructor (lemma){
		this.lemma = lemma;
		this.extended = Promise.resolve(lemma.extendedWord);
		this.initializePrimary()
	}

	getLemma() {
		return this.lemma
	}

	initializePrimary(){
		this.google = new GoogleService(this.extended);
		this.multitran = new MultitranService(this.extended);
		//this.reverso = new ReversoService(this.extended);
	}

	initializeSecondary(){
		//this.wiktionary = new Wiktionary(this.extended)
		//this.pons = new PonsService(this.extended);
		//this.glosbe = new GlosbeService(this.extended);
		//this.duden = new DudenService(this.extended)
	}

	simpleTranslate(){
		return this.google.getTranslatedWord().then((word) => word.getTranslations().join(", "));
	}

	getInfo(){
		return this.extended.then((word) => {
			return (word.gender == null ? '' : `(${word.gender}) `) + word.type
		})
	}

	getMultitranTranslations(){
		return this.multitran.getTranslatedWord().then((word) => {
			return word.getTranslations()[0];
		})
	}

}
export {Translator};