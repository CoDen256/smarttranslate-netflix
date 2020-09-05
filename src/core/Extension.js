import {config} from './config.js'
import {Translator} from './Translator.js'
import {replaceWithSpans} from './Utils.js'

class Extension {
	constructor(builder, subtitleProvider){
		console.log("Extension created")
		this.launched = false;
		this.builder = builder;
		this.subtitleProvider = subtitleProvider;
	}

	wordClicked(event, builder){
		debugger
		console.log("Word is clicked", event.target, event.target.textContent)

		let lemma = this.findWord(event.target.textContent, this.subtitleProvider.getSubtitle());



		//console.log(this.wordMap)

		//if (!this.wordMap[word]){
		//	console.log("new translator after clicked");
		//	this.wordMap[word] = new Translator(event.target.textContent)
		//}
//
		//let translator = wordMap[event.target.textContent]

		builder.createTranslationPopup(null);

	};

	findWord(wordToFind, ltc_sentence) {
		for (let word of ltc_sentence) {
			if (word.original.toLowerCase() === wordToFind.toLowerCase()) {
				return word;
			}
		}
	}

	addSentence(sent){
		if (this.lastSentece === sent) return;
		this.lastSentece = sent;
		this.sentences.push(sent)
		console.log(this.sentences)
	}

	wrapWordsWithSpans(span){
		if (span.id === config.wordEditedId) return false;

		span.id = config.wordEditedId
		span.innerHTML = "<br>"+replaceWithSpans(span.textContent, config.wordEditedId, config.hoverableWordClass);

		const wordHandlerReference = (event) => this.wordClicked(event, this.builder)

		span.querySelectorAll('span').forEach((span) => span.addEventListener('click', wordHandlerReference))
	}

	addSubtitle(span){
		if (span.id === config.wordEditedId) return false;
	}

	update(newItem){
		const wrapWordsWithSpansReference = (span) => this.wrapWordsWithSpans(span);
		const addSubtitleReference = (span) => this.addSubtitle(span)

		console.log("Current subtitle line:", this.subtitleProvider.getSubtitle())

		this.launched = true;
		let wait = false;
		newItem.addEventListener("DOMNodeInserted", function (e) {
			if(wait){return false;}
			wait = true;
			setTimeout(function(){
				wait = false;
				try{ //TODO: may be add each word to sentece and to TranslatorService as well and only then wrap with spans
					  // TODO: Akkusativ/Dativ adverbs or somtehing else for verbs
					  // TODO: English translations


					let spans = newItem.querySelectorAll('span')
					spans.forEach(addSubtitleReference)
					spans.forEach(wrapWordsWithSpansReference);		
				}catch(e){
					console.log(e)
					return false;
				}	
				
			},100)
		}, false);	
	}
}

export {Extension};