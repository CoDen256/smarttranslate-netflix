import {WordMeaningService} from '../WordMeaningService.js';
import {Config} from "../../core/config.js";
import {MeaningWord} from "../entities.js";

const dudenUrl = "https://www.duden.de/rechtschreibung/{QUERY}"
const dudenApi = dudenUrl;

const params = {}

class DudenService {
    constructor(extendedWord) {
        this.service = null
        this.extendedWord = extendedWord

        if (!this.isUnsupported()){
            this.service = new WordMeaningService(
                dudenApi,
                params,
                extendedWord,
                this)
        } else {
            console.warn("DUDEN IS DISABLED")
        }

    }

    prepare(word) {
        return word
            .replace("ü", "ue")
            .replace("ä", "ae")
            .replace("ö", "oe")
            .replace("ß", "sz")
    }

    normalize(raw) {
        return raw.text()
    }

    parse(normalized) { // => Array<String> - meanings
        // TODO sometimes not parsing meanings (e.g for Pizza)
        let doc = new DOMParser().parseFromString(normalized, 'text/html')
        let meanings = []
        doc.querySelectorAll(".enumeration__text").forEach((enumText) => {
            meanings.push(enumText.textContent)
        })
        return meanings;
    }

    getMeaningWord() {
        if (this.isUnsupported()){
            return new MeaningWord(this.extendedWord)
        }
        return this.service.getMeaningWord();
    }

    isUnsupported(){
        return Config.getCurrentSettings().language !== "de"
    }

}

export {DudenService, dudenUrl, params}