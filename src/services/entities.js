class ExtendedWord {
	constructor(original){// parses all info from wiktionary or another resource
		this.original = original;
		this.mainForm = original; // main form of word word
		this.type = null; // verb noun adj etc
		this.gender = null;
		this.meaning = null;
	}

}

class TranslatedWord{
	constructor(extendedWord, translation){ // normilized Word: ExtendedWord
		this.extendedWord = extendedWord
		this.translation = translation; // each service fives own translation, maybe even several translations
	}
}

export {ExtendedWord, TranslatedWord}