import {config} from './config.js'
import {Translator} from './Translator.js'
import {replaceWithSpans} from './Utils.js'

class Extension {
	constructor(builder){
		console.log("Extension created")
		this.launched = false;
		this.builder = builder;
		this.script = "";
		this.wordMap = {
			// word: Translator
		}

		// TODO: CACHE
		this.lastSentece = ""
		this.sentences = []
	}

	wordClicked(event, builder){
		console.log("Word is clicked", event.target, event.target.textContent)
		//console.log(this.wordMap)

		//if (!this.wordMap[word]){
		//	console.log("new translator after clicked");
		//	this.wordMap[word] = new Translator(event.target.textContent)
		//}
//
		//let translator = wordMap[event.target.textContent]

		builder.createTranslationPopup(null);

	};

	addSentence(sent){
		if (this.lastSentece == sent) return;
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