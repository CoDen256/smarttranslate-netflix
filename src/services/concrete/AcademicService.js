import {WordTranslationService} from '../WordTranslationService.js'
import {Config} from '../../core/util/config.js'
import {create, displayFailMessage, select} from "../../core/util/Utils.js";
import {URL} from "../../core/util/URL.js";

const academicUrl = "https://translate.academic.ru/{QUERY}/{SOURCE}/{TARGET}"
const academicApi = academicUrl


class AcademicService {
    constructor(extendedWord) {
        this.service = new WordTranslationService(
            academicApi,
            AcademicService.generateParams(),
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
        doc.querySelector("#article")
            .querySelector(".terms-list")
            .querySelectorAll("li").forEach((item) => {
            translations.push(item)
        })
        return translations;
    }

    getTranslatedWord() {
        return this.service.getTranslatedWord();
    }

    static generateParams() {
        return {
            source: Config.getLanguage(),
            target: Config.getTargetLanguage()
        }
    }

    getLink() {
        return URL.replaceAll(academicUrl, this.service.abstractService.getParams())
    }

    render() {
        let tab = select("#tab-academic")

        tab.querySelector("a").href = this.getLink()

        let content = tab.querySelector(".dictionary-content")
        content.innerHTML = ""

        this.getTranslatedWord()
            .then((word) => word.getTranslations())
            .then((translations) => this.displayTranslations(content, translations))
    }

    displayTranslations(content, translations){
        if (translations.length === 0) {
            displayFailMessage(content);
            return
        }

        translations.forEach((translationItem) => {
            let item = create("li", "dictionary-content-item")
            item.innerHTML = translationItem.innerHTML;
            content.appendChild(item)
        })
    }

}

export {AcademicService}