import {WordTranslationService} from '../WordTranslationService.js'
import {Config} from '../../core/util/config.js'
import {create, select} from "../../core/util/Utils.js";
import {URL} from "../../core/util/URL.js";

const multitranUrl = "https://www.multitran.com/m.exe?l1={SOURCE}&l2={TARGET}&s={QUERY}"
const multitranApi = multitranUrl

const multitranConvention = {
    "de": "3",
    "ru": "2",
    "en": "1"
}

//TODO: different translations je nach WortArt
class MultitranService {
    constructor(extendedWord) {
        this.service = new WordTranslationService(
            multitranApi,
            MultitranService.generateParams(),
            extendedWord,
            this
        )
    }

    normalize(raw) {
        return raw.text()
    }

    parse(normalized) { // Array<String> - translations
        let doc = new DOMParser().parseFromString(normalized, 'text/html')
        let translations = []
        doc.querySelectorAll(".trans").forEach((trans) => {
            trans.querySelectorAll("a").forEach(a => {
                if (a.parentNode.nodeName === "TD") {
                    translations.push(a.textContent)
                }
            })

        })
        return translations;
    }

    getTranslatedWord() {
        return this.service.getTranslatedWord();
    }

    static generateParams() {
        return {
            source: multitranConvention[Config.getLanguage()],
            target: multitranConvention[Config.getTargetLanguage()]
        }
    }

    getLink() {
        return URL.replaceAll(multitranUrl, this.service.abstractService.getParams() )
    }

    render() {
        WordTranslationService.render(this.getTranslatedWord(),"#tab-multitran", this.getLink())
    }

}

export {MultitranService}