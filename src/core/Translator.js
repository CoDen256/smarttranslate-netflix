import {WiktionaryService} from '../services/concrete/WiktionaryService.js'
import {GoogleService} from '../services/concrete/GoogleService.js'
import {ReversoService} from '../services/concrete/ReversoService.js'
import {MultitranService} from '../services/concrete/MultitranService.js'
import {DudenService } from '../services/concrete/DudenService.js';
import {GlosbeService} from '../services/concrete/GlosbeService.js';
import {PonsService} from '../services/concrete/PonsService.js'
import {Verb, Substantiv, SimplePartOfSpeech} from "../services/entities.js";

class Translator{
	constructor (lemma){
		this.lemma = lemma;
		this.initializePrimary()
	}

	initializePrimary(){
		this.google = new GoogleService(this.getExtended());
		this.multitran = new MultitranService(this.getExtended());
		this.wiktionary = new WiktionaryService(this.getExtended())
		//this.reverso = new ReversoService(this.extended);
	}

	initializeSecondary(){
		//this.pons = new PonsService(this.extended);
		//this.glosbe = new GlosbeService(this.extended);
		//this.duden = new DudenService(this.extended)
	}

	simpleTranslate(){
		return this.google.getTranslatedWord().then((word) => word.getTranslations().join(", "));
	}

	getMultitranTranslations(){
		return this.multitran.getTranslatedWord().then((word) => {
			return word.getTranslations()[0];
		})
	}

	getInfo(){
		return Promise.resolve(this.getLemma().info())
		//return this.wiktionary.getMeaningWord().then((word) => {
		//	return word.info()
		//})
	}


	getLemma() {
		return this.lemma
	}

	getExtended() {
		return this.lemma.extendedWord
	}

	isDefault(){
		return this.lemma.isDefault()
	}

	getOriginal() {
		return this.getExtended().original
	}

	getMainForm() {
		return this.getExtended().mainForm
	}

	getPrefix() {
		return this.lemma.prefix
	}

	isReflex() {
		return this.lemma.reflex
	}

	getGender() {
		return this.lemma.gender
	}

	isVerb() {
		return this.lemma instanceof Verb
	}

	isSubstantiv() {
		return this.lemma instanceof Substantiv
	}

}
export {Translator};