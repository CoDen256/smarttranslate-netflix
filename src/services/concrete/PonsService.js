import {WordTranslationService} from '../WordTranslationService.js'
import {Config} from '../../core/util/config.js'
import {create, select} from "../../core/util/Utils.js";
import {URL} from "../../core/util/URL.js";

const ponsUrl = "https://en.pons.com/translate/{SOURCE_FULL}-{TARGET_FULL}/{QUERY}"
const ponsApi = ponsUrl


// Provides usages and translations
// Provides synonyms
class PonsService {
    constructor(extendedWord) {
        this.service = new WordTranslationService(
            ponsApi,
            PonsService.generateParams(),
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
        //doc.querySelector(".entry .first").querySelectorAll(".target")
        doc.querySelectorAll(".dd-inner").forEach((target) => {
            target.querySelectorAll("span").forEach(span => span.remove())
            translations.push(target.textContent.trim())

        })
        return translations;
    }

    getTranslatedWord() {
        return this.service.getTranslatedWord();
    }

    static generateParams() {
        return {
            sourceFull: Config.getLanguageFull(),
            targetFull: Config.getTargetLanguageFull(),
        }
    }

    getLink(){
        return URL.replaceAll(ponsUrl, this.service.abstractService.getParams())
    }

    render() {
        WordTranslationService.render(this.getTranslatedWord(), "#tab-pons", this.getLink())
    }
}

export {PonsService}