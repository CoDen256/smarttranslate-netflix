class Translator{
	constructor (initialWord, sentence){
		this.initialWord = initialWord;
		this.sentence = sentence;
	}

	simpleTranslate(){
		return "*"+this.initialWord+"*"
	}
}

export {Translator};