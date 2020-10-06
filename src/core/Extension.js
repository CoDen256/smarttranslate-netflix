import {config} from './config.js'
import {Translator} from './Translator.js'
import {joinLemma, replaceWithSpans} from './Utils.js'
import {PoSConverter} from "./Converter.js";
import {TimedSubtitleProvider} from "./TimedSubtitleProvider.js"
import {NetflixPlayer} from "./Player.js";
import {NetflixSubtitleNavigator} from "./NetflixSubtitleNavigator.js";

class Extension {
    constructor(builder, script) {
        console.log("Extension created")
        this.launched = false;
        this.builder = builder;
        this.script = script;

        this.player = new NetflixPlayer();
        this.navigator = new NetflixSubtitleNavigator();
        this.subtitleProvider = new TimedSubtitleProvider(script);

        const pressed = (e) => this.pressed(e)
        document.body.addEventListener("keydown", pressed)
        document.body.addEventListener("mousedown", pressed)
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

        if (!this.subtitleProvider.isLoaded()) {
            console.warn("Subtitle Provider is not loaded")
            builder.createTranslationPopup(new Translator(PoSConverter.convert(null, word)))
            return;
        }
        let {ltc, probability} = this.subtitleProvider.getSubtitleByLine(netflix_line);
        let ltc_sentence = joinLemma(ltc)

        console.log("[ACTUAL]", netflix_line)
        console.log("[PREDICTED]", ltc_sentence, "\t[probability]:", probability)

        //console.log("[SRT TIME]", ltc.start || null, "-->", ltc.end || null)

        let lemma = this.findWord(word, ltc.lemmas || null);

        let converted = PoSConverter.convert(lemma, word)
        console.assert(converted !== undefined && converted != null)
        console.log("Building popup for...", converted)
        builder.createTranslationPopup(new Translator(converted));
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

        await this.navigator.load()
        this.navigator.update(this.player.getCurrentTime())

        span.id = config.wordEditedId
        span.innerHTML = "<br>" + replaceWithSpans(span.textContent, config.wordEditedId, config.hoverableWordClass);

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