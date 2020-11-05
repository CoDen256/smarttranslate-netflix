import {WordMeaningService} from '../WordMeaningService.js';
import {Config} from "../../core/util/config.js";
import {MeaningWord} from "../entities.js";
import {create, select} from "../../core/util/Utils.js";
import {URL} from "../../core/util/URL.js";

const dudenUrl = "https://www.duden.de/rechtschreibung/{QUERY}"
const dudenApi = dudenUrl;

class DudenService {
    constructor(extendedWord) {
        this.service = this.createService(extendedWord)
        this.extendedWord = extendedWord
    }

    createService(extendedWord) {
        if (this.isUnsupported()) {
            console.warn("DUDEN.DE IS DISABLED")
            return null
        }
        return new WordMeaningService(
            dudenApi,
            DudenService.generateParams(),
            extendedWord,
            this)
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
        if (this.isUnsupported()) {
            return Promise.resolve(new MeaningWord(this.extendedWord))
        }
        return this.service.getMeaningWord();
    }

    isUnsupported() {
        return Config.getLanguage() !== "de"
    }

    static generateParams() {
        return {}
    }

    getLink() {
        if (this.isUnsupported()){
            return URL.replaceAll(dudenUrl, {query: ""})
        }
        return URL.replaceAll(dudenUrl, this.service.abstractService.getParams())
    }

    static render(duden) {
        let tab = select("#tab-duden")

        tab.querySelector("a").href = duden.getLink()

        let content = tab.querySelector(".dictionary-content")
        content.innerHTML = ""

        duden.getMeaningWord()
            .then(word => word.getMeanings())
            .then((meanings) => {
                meanings.forEach((meaning) => {
                    // <li class="dictionary-content-item">
                    let item = create("li", "dictionary-content-item")
                    item.innerHTML = "🞄 " + meaning;
                    content.appendChild(item)
                })
            })
    }

}

export {DudenService}