import {WordContextService} from '../WordContextService.js'
import {Config} from '../../core/util/config.js'


const reversoUrl = "https://context.reverso.net/translation/{SOURCE_FULL}-{TARGET_FULL}/{QUERY}"
const reversoApi = reversoUrl

class ReversoService {
    constructor(extendedWord) {
        this.service = new WordContextService(
            reversoApi,
            ReversoService.getParams(),
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

    static getParams() {
        return {
            sourceFull: Config.getLanguageFull(),
            targetFull: Config.getTargetLanguageFull(),
        }
    }

}


export {ReversoService, reversoUrl}