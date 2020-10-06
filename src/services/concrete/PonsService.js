import {WordTranslationService} from '../WordTranslationService.js'
import {config} from '../../core/config.js'

const ponsUrl = "https://en.pons.com/translate/{SOURCE_FULL}-{TARGET_FULL}/{QUERY}"
const ponsApi = ponsUrl
const params = {
    sourceFull: config.sourceLangFull,
    targetFull: config.targetLangFull,
}

// Provides usages and translations
// Provides synonyms
class PonsService {
    constructor(extendedWord) {
        this.service = new WordTranslationService(
            ponsApi,
            params,
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
}

export {PonsService, ponsUrl, params}