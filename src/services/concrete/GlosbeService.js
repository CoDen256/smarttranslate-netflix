import {WordContextService} from '../WordContextService.js'
import {Config} from '../../core/util/config.js'
import {create, select} from "../../core/util/Utils.js";
import {URL} from "../../core/util/URL.js";

const glosbeUrl = "https://{SOURCE}.glosbe.com/{SOURCE}/{TARGET}/{QUERY}"
const glosbeApi = glosbeUrl;

class GlosbeService {
    constructor(extendedWord) {
        this.service = new WordContextService(
            glosbeApi,
            GlosbeService.generateParams(),
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
        doc.querySelectorAll(".translate-example-text").forEach((example) => {
            let src = example.querySelector(".translate-example-source")
            let srcEm = src.querySelector(".translate-example-text-highlight")

            // Glosbe API probably returning fake translations, so there is no actual translations

            // let trg =  example.querySelector(".translate-example-target")
            // let trgEm = trg.querySelector(".translate-example-text-highlight")
            // trg.querySelector(".translate-example-text-origin-placeholder").remove()
            // trg.querySelector(".translate-example-text-origin-placeholder").remove()

            contexts.push([this.highlight(src, srcEm), ""])
        })
        return contexts;
    }

    getContextWord() {
        return this.service.getContextWord();
    }

    highlight(original, toHighlight) {
        if (toHighlight == null) {
            return original.textContent.trim()
        }

        return original.textContent.trim().replace(toHighlight.textContent, `{{${toHighlight.textContent}}}`)
    }

    static generateParams(){
        return {
            source: Config.getLanguage(),
            target: Config.getTargetLanguage()
        }
    }

    getLink(){
        return URL.replaceAll(glosbeUrl, this.service.abstractService.getParams())
    }

    static render(glosbe) {
        let tab = select("#tab-glosbe")

        tab.querySelector("a").href = glosbe.getLink()

        let content = tab.querySelector(".dictionary-content")
        content.innerHTML = ""
        glosbe.getContextWord().then((context) => {
            return context.getContexts()
        }).then((contexts) => {
            contexts.forEach((context) => {
                // <li class="dictionary-content-item">
                let item = create("li", "dictionary-content-item")
                let sent = this.emphasize(context.sentence)
                item.innerHTML = "🞄 " + sent + "<br><br>"
                content.appendChild(item)
            })
        })
    }

    static emphasize(sentence) {
        return sentence
            .replace("{{", "<span style='color:yellow'><em><strong>")
            .replace("}}", "</strong></em></span>");
    }

}

export {GlosbeService}