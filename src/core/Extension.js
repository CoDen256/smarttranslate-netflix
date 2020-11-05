import {config} from './config.js'
import {Translator} from './Translator.js'
import {joinLemma, replaceWithSpans} from './Utils.js'
import {PoSConverter} from "./Converter.js";
import {LTCProvider} from "./player/LTCProvider.js"
import {NetflixPlayer} from "./player/Player.js";
import {NetflixNavigator} from "./player/NetflixNavigator.js";
import {PopupBuilder} from "./PopupBuilder.js";

class Extension {
    constructor(script) {
        console.log("Extension created")
        this.launched = false;
        this.builder = new PopupBuilder();
        this.player = new NetflixPlayer()
        this.navigator = new NetflixNavigator();

        this.subtitleProvider = new LTCProvider(script);

        document.body.addEventListener("keydown", (e) => this.pressed(e))
        document.body.addEventListener("mousedown", (e) => this.pressed(e))
    }

    pressed(event) {
        if (event.code === "KeyQ" || event.button === 4) {
            this.builder.removeTranslationPopup()
            this.player.play()
        }
        if (event.code === "Enter" || event.button === 1) {
            this.builder.onEnter()
        }
        if (event.code === "KeyA") {
            this.player.seek(this.navigator.previous())
        }
        if (event.code === "KeyD") {
            this.player.seek(this.navigator.next())
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
        builder.createTranslationPopup(new Translator(target));
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
        if (span.id === config.wordEditedId) return false;

        await this.navigator.initialize()
        this.navigator.update(this.player.getCurrentTime())

        span.id = config.wordEditedId
        span.innerHTML = replaceWithSpans(span.textContent, config.wordEditedId, config.hoverableWordClass) + "<br>";

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
            setTimeout(function () {
                wait = false;
                try { //TODO: may be add each word to sentece and to TranslatorService as well and only then wrap with spans
                    // TODO: Akkusativ/Dativ adverbs or somtehing else for verbs
                    // TODO: English translations
                    // TODO: consider the time() at which element was firstly created, to go back to it
                    let spans = targetItem.querySelectorAll('span')
                    //console.log("[NETFLIX]:", time())
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