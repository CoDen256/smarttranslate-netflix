import {config} from './config.js'
import {Translator} from '../services/Translator.js'
import {replaceWithSpans} from './Utils.js'

class Extension {
	constructor(builder){
		console.log("Extension created")
		this.launched = false;
		this.builder = builder;
	}

	wordClicked(event, builder){
		console.log("Word is clicked", event.target, event.target.textContent)

		let translator = new Translator(event.target.textContent)

		builder.removeTranslationPopup()
		builder.createTranslationPopup(translator);
		builder.activateTranslationPopup()

	
	};

	wrapWordsWithSpans(span){
		if (span.id === config.wordEditedId) return false;

		span.id = config.wordEditedId
		span.innerHTML = "<br>"+replaceWithSpans(span.textContent, config.wordEditedId, config.hoverableWordClass);

		const wordHandlerReference = (event) => this.wordClicked(event, this.builder)
		span.querySelectorAll('span').forEach((word) => word.addEventListener('click', wordHandlerReference));
	}

	update(newItem){
		const wrapWordsWithSpansReference = (span) => this.wrapWordsWithSpans(span);

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
					newItem.querySelectorAll('span').forEach(wrapWordsWithSpansReference);		
				}catch(e){
					console.log(e)
					return false;
				}	
				
			},100)
		}, false);	
	}
}

export {Extension};