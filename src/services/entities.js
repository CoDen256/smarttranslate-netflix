// TYPES: https://de.wiktionary.org/wiki/Hilfe:Wortart
// GENDER : "f", "m", "n"

class ExtendedWord {
	constructor(original){// parses all info from wiktionary or another resource
		this.original = original;
		this.mainForm = original; // main form of word
		this.type = null; 
		this.gender = null;
	}

}

class TranslatedWord{
	constructor(extendedWord){ // normilized Word: ExtendedWord
		this.extendedWord = extendedWord // each service fives own translation, maybe even several translations
		this.translations = [];
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

class MeaningWord {
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
		if (sentence == null || sentence === "" || translation == null || translation === "") return;
		this.contexts.push(new Context(sentence, translation))
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