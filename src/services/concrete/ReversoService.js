import {WordContextService} from '../WordContextService.js'
import {Config} from '../../core/util/config.js'
import {create, displayFailMessage, emphasize, select} from "../../core/util/Utils.js";
import {URL} from "../../core/util/URL.js";


const reversoUrl = "https://context.reverso.net/translation/{SOURCE_FULL}-{TARGET_FULL}/{QUERY}"
const reversoApi = reversoUrl

class ReversoService {
    constructor(extendedWord) {
        this.service = new WordContextService(
            reversoApi,
            ReversoService.generateParams(),
            extendedWord,
            this
        )
    }

    normalize(raw) {
        return raw.text()
    }

    parse(normalized) { // Array<Array<String, String>> - Array<Context<original, translation>>>
        let doc = new DOMParser().parseFromString(normalized, 'text/html')
        let contexts = []
        doc.querySelectorAll(".example").forEach((example) => {
            let src = example.querySelector(".src").querySelector(".text")
            let trg = example.querySelector(".trg").querySelector(".text")

            let srcEm = src.querySelector("em")
            let trgEm = trg.querySelector("em")

            contexts.push([this.highlight(src, srcEm), this.highlight(trg, trgEm)])
        })
        return contexts;
    }

    getContextWord() {
        return this.service.getContextWord();
    }

    highlight(original, toHighlight) {
        if (toHighlight == null) {
            // console.log("To highlight from reverso", toHighlight, original)
            return original.textContent.trim();
        }

        return original.textContent.trim().replace(toHighlight.textContent, `{{${toHighlight.textContent}}}`)
    }

    static generateParams() {
        return {
            sourceFull: Config.getLanguageFull(),
            targetFull: Config.getTargetLanguageFull(),
        }
    }

    getLink() {
        return URL.replaceAll(reversoUrl, this.service.abstractService.getParams())
    }

    render() {
        let tab = select("#tab-reverso")

        tab.querySelector("a").href = this.getLink()

        let content = tab.querySelector(".dictionary-content")

        content.innerHTML = ""
        this.getContextWord()
            .then((context) => context.getContexts())
            .then((contexts) => this.displayContexts(content, contexts))
    }


    displayContexts(content, contexts) {
        if (contexts.length === 0) {
            displayFailMessage(content);
            return
        }
        contexts.forEach((context) => {
            // <li class="dictionary-content-item">
            let item = create("li", "dictionary-content-item")
            let sent = emphasize(context.sentence)
            let translation = emphasize(context.translation)

            item.innerHTML = "🞄 " + sent + "<br>🞄 " + translation + "<br><br>"
            content.appendChild(item)
        })
    }

}


export {ReversoService}