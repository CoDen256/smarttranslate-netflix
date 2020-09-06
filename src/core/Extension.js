import {config} from './config.js'
import {Translator} from './Translator.js'
import {convertToSeconds, replaceWithSpans, timeOfSeconds, joinLemma, similarity} from './Utils.js'
import {PoSConverter} from "./Converter.js";
import {TimedSubtitleProvider} from "./TimedSubtitleProvider.js"
class Extension {
	constructor(builder, script){
		console.log("Extension created")
		this.launched = false;
		this.builder = builder;
		this.script = script;

		this.subtitleProvider = new TimedSubtitleProvider(script);
	}

	wordClicked(event, builder){
		let word = event.target.textContent;

		let shift = 1 + 0.845322
		let current_time = timeOfSeconds(this.getCurrentTimeCode())
		let netflix_time = convertToSeconds(current_time)+ shift

		let netflix_line = this.getLine(event.target)

		console.log("[WORD]", event.target, word)
		console.log("[LINE]", netflix_line)
		console.log("[TIME]:", current_time)
		console.log("[ESTIMATED TIME]:", timeOfSeconds(netflix_time))



		let subtitle_lemma = this.subtitleProvider.getSubtitleByTime(timeOfSeconds(netflix_time));
		let lemma_line = joinLemma(subtitle_lemma)
		console.log("[SRT LINE]", lemma_line, subtitle_lemma.start, "-->", subtitle_lemma.end)
		console.log("[SIMILARITY]", similarity(lemma_line, netflix_line))
		//let lemma = this.findWord(word, subtitle_line.lemmas);

		//let converted = PoSConverter.convert(lemma, word)
//
		//console.log("Building popup for...", converted)
		//builder.createTranslationPopup(new Translator(converted));

	};

	findWord(wordToFind, ltc_sentence) {
		for (let word of ltc_sentence) {
			if (word.original.toLowerCase() === wordToFind.toLowerCase()) {
				return word;
			}
		}
		return null;
	}

	wrapWordsWithSpans(span){
		if (span.id === config.wordEditedId) return false;

		span.id = config.wordEditedId
		span.innerHTML = "<br>"+replaceWithSpans(span.textContent, config.wordEditedId, config.hoverableWordClass);

		const wordHandlerReference = (event) => this.wordClicked(event, this.builder)

		span.querySelectorAll('span').forEach((span) => span.addEventListener('click', wordHandlerReference))
	}

	getCurrentTimeCode() {
		return document.querySelectorAll('video')[0].currentTime
	}

	getLine(word) {
		let spans =  word.parentElement.parentElement.children
		let line = ""
		for (let i = 0; i < spans.length; i++) {
			line += spans[i].textContent + " ";
		}
		return line
	}

	start(targetItem){
		const wrapWordsWithSpansReference = (span) => this.wrapWordsWithSpans(span);
		const time = () => timeOfSeconds(this.getCurrentTimeCode())
 		this.launched = true;
		let wait = false;
		targetItem.addEventListener("DOMNodeInserted", function (e) {
			if(wait){return false;}
			wait = true;
			setTimeout(function(){
				wait = false;
				try{ //TODO: may be add each word to sentece and to TranslatorService as well and only then wrap with spans
					  // TODO: Akkusativ/Dativ adverbs or somtehing else for verbs
					  // TODO: English translations
					let spans = targetItem.querySelectorAll('span')
					console.log("[NETFLIX]:", time())
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