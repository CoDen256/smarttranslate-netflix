import {wordEditedId, hoverableWordClass} from './util/config.js'
import {TranslatorService} from './TranslatorService.js'
import {joinLemma, replaceWithSpans} from './util/Utils.js'
import {PoSConverter} from "./sublem/PartOfSpeechConverter.js";
import {LTCProvider} from "./sublem/LTCProvider.js"
import {NetflixPlayer} from "./player/NetflixPlayer.js";
import {NetflixNavigator} from "./player/NetflixNavigator.js";
import {PopupBuilder} from "./PopupBuilder.js";

class Extension {
    constructor(script) {
        console.log("Extension created")
        this.launched = false;
        this.builder = new PopupBuilder();
        this.player = new NetflixPlayer()
        this.navigator = new NetflixNavigator(this.player);

        this.subtitleProvider = new LTCProvider(script);

        this.addListeners()
    }

    addListeners(){
        document.body.addEventListener("keydown", (e) => this.keyOrMouseDown(e))
        document.body.addEventListener("mousedown", (e) => this.keyOrMouseDown(e))
    }

    keyOrMouseDown(event) {
        if (event.code === "KeyQ" || event.button === 4) {
            this.builder.removeTranslationPopup()
            this.player.play()
        }
        if (event.code === "Enter") {
            this.builder.submit()
        }
        if (event.code === "KeyA") {
            this.navigator.seekPrev()
        }
        if (event.code === "KeyD") {
            this.navigator.seekNext()
        }
    }

    wordClicked(event, builder) {
        let word = event.target.textContent;
        let netflix_line = this.getLine(event.target)
        console.log("[WORD]", event.target, word)

        let target;
        if (!this.subtitleProvider.isLoaded()) {
            console.warn("LTC Provider is not loaded")
            target = PoSConverter.convert(null, word);

        } else {
            let {ltc, probability} = this.subtitleProvider.getSubtitleByLine(netflix_line);
            let ltc_sentence = joinLemma(ltc)

            console.log("[ACTUAL]", netflix_line)
            console.log("[PREDICTED]", ltc_sentence, "\t[probability]:", probability)
            //console.log("[SRT TIME]", ltc.start || null, "-->", ltc.end || null)

            let lemma = this.findWord(word, ltc.lemmas || null);

            target = PoSConverter.convert(lemma, word)
            console.assert(target !== undefined && target != null)
        }

        console.log("Building popup for...", target)
        builder.createTranslationPopup(new TranslatorService(target));
        this.player.pause()
    };

    findWord(wordToFind, ltc_sentence) {
        if (ltc_sentence == null) return null;

        for (let word of ltc_sentence) {
            if (word.original.toLowerCase() === wordToFind.toLowerCase()) {
                return word;
            }
        }
        return null;
    }

    async wrapWordsWithSpans(span) {
        if (span.id === wordEditedId) return false;

        span.id = wordEditedId
        span.innerHTML = replaceWithSpans(span.textContent, wordEditedId, hoverableWordClass) + "<br>";

        const wordHandlerReference = (event) => this.wordClicked(event, this.builder)

        span.querySelectorAll('span').forEach((span) => span.addEventListener('click', wordHandlerReference))
    }

    getLine(word) {
        let spans = word.parentElement.parentElement.children
        return this.getFullLine(spans)
    }

    getFullLine(spans) {
        let line = ""
        for (let i = 0; i < spans.length; i++) {
            line += spans[i].textContent + " ";
        }
        return line
    }

    start(targetItem) {
        const wrapWordsWithSpansReference = (span) => this.wrapWordsWithSpans(span);
        this.launched = true;
        let wait = false;
        targetItem.addEventListener("DOMNodeInserted", function (e) {
            if (wait) {
                return false;
            }
            wait = true;
            setTimeout(() => {
                wait = false;
                try { //TODO: may be add each word to sentece and to TranslatorService as well and only then wrap with spans
                    // TODO: Akkusativ/Dativ adverbs or somtehing else for verbs
                    // TODO: English translations
                    let spans = targetItem.querySelectorAll('span')
                    spans.forEach(wrapWordsWithSpansReference);
                } catch (e) {
                    console.log(e)
                    return false;
                }

            }, 100)
        }, false);
    }
}

export {Extension};