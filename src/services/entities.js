// TYPES: https://de.wiktionary.org/wiki/Hilfe:Wortart
// GENDER : "f", "m", "n"

class ExtendedWord {// TODO: Maybe will contain full parsed data in itself
	constructor(original){// parses all info from wiktionary or another resource
		this.original = original;
		this.mainForm = original; // main form of word
		this.type = null; 
		this.gender = null;
	}

	clone(){
		let cloned = new ExtendedWord(this.original);
		cloned.mainForm = this.mainForm
		cloned.type = this.type;
		cloned.gender = this.gender;
		return cloned;
	}

}

class TranslatedWord{ 
	constructor(extendedWord){ // normilized Word: ExtendedWord
		this.extendedWord = extendedWord // each service fives own translation, maybe even several translations
		this.translations = []; //TODO: Maybe Translation - class
	}

	getTranslations(){ // Array<String> of translations
		return this.translations;
	}

	addTranslations(newTranslations = []){
		if (newTranslations === []) return;
		this.translations = this.translations.concat(newTranslations)
		return this;
	}

	addTranslation(newTranslation = ""){
		if (newTranslation == null || newTranslation === "") return;
		this.translations.push(newTranslation)
		return this;
	}
}

class MeaningWord {// TODO: synonyme
	constructor(extendedWord){
		this.extendedWord = extendedWord;
		this.meanings = [];
	}
	getMeanings(){ // Array<String> of meanings
		return this.meanings;
	}

	addMeanings(newMeanings = []){
		if (newMeanings === []) return;
		this.meanings = this.meanings.concat(newMeanings)
		return this;
	}

	addMeaning(newMeaning = ""){
		if (newMeaning == null || newMeaning === "") return;
		this.meanings.push(newMeaning)
		return this;
	}
}

class ContextWord {
	constructor(extendedWord){
		this.extendedWord = extendedWord;
		this.contexts = [];
	}
	getContexts(){ // Array<Context> of contexts
		return this.contexts;
	}

	addContext(sentence = "", translation = ""){
		if (sentence == null || sentence === "") return;
		this.contexts.push(new Context(sentence, translation))
		return this;
	}
	
	addContexts(newContexts){ // Array<Array<String, String>>
		newContexts.forEach(pair => {
			this.addContext(pair[0], pair[1])
		})
		return this;
	}
}

class Context{
	constructor(sentence = "", translation= ""){
		this.sentence = sentence;
		this.translation = translation;
	}
}

export {ExtendedWord, TranslatedWord, MeaningWord, ContextWord, Context}