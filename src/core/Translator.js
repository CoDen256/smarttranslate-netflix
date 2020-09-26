import {WiktionaryService} from '../services/concrete/WiktionaryService.js'
import {GoogleService} from '../services/concrete/GoogleService.js'
import {ReversoService} from '../services/concrete/ReversoService.js'
import {MultitranService} from '../services/concrete/MultitranService.js'
import {DudenService } from '../services/concrete/DudenService.js';
import {GlosbeService} from '../services/concrete/GlosbeService.js';
import {PonsService} from '../services/concrete/PonsService.js'
import {Verb, Substantiv, SimplePartOfSpeech} from "../services/entities.js";

let GENDERS = {
	"m": "der",
	"f": "die",
	"n": "das",
}


class Translator{
	constructor (extended){
		this.extended = extended;
		this.initializePrimary();
		this.initializeSecondary()
	}

	initializePrimary(){
		this.google = new GoogleService(this.getExtended());
		// this.multitran = new MultitranService(this.getExtended());
		this.wiktionary = new WiktionaryService(this.getExtended())
	}

	initializeSecondary(){
		this.reverso = new ReversoService(this.getExtended());
		// this.pons = new PonsService(this.getExtended())
		// this.duden = new DudenService(this.getExtended())
		// this.glosbe = new GlosbeService(this.getExtended());
	}

	simpleTranslate(){
		return this.google.getTranslatedWord().then((word) => word.getTranslations().join(", "));
	}

	getMultitranTranslations(){
		return this.multitran.getTranslatedWord().then((word) => {
			return word.getTranslations()[0];
		})
	}

	getReversoContexts() {
		return this.reverso.getContextWord().then((context) => {
			console.warn(context)
			return context.getContexts()
		})
	}

	getPonsTranslations(){
		return this.pons.getTranslatedWord().then((word) => {
			return word.getTranslations()[0];
		})
	}

	getGender() {
		return this.wiktionary.getMeaningWord().then(meaning => meaning.extendedWord)
			.then(extended => GENDERS[extended.pos.gender])
	}
	getInfo(){
		return Promise.resolve(this.getPoS().info())
		//return this.wiktionary.getMeaningWord().then((word) => {
		//	return word.info()
		//})
	}


	getPoS() {
		return this.getExtended().pos
	}

	getExtended() {
		return this.extended
	}

	isDefault(){
		return this.getExtended().isDefault()
	}

	getOriginal() {
		return this.getExtended().original
	}

	getMainForm() {
		return this.getExtended().mainForm
	}

	getPrefix() {
		return this.getPoS().prefix
	}

	isReflex() {
		return this.getPoS().reflex
	}


	isVerb() {
		return this.getPoS() instanceof Verb
	}

	isSubstantiv() {
		return this.getPoS() instanceof Substantiv
	}

}
export {Translator};