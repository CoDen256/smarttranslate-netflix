import {WordTranslationService} from '../WordTranslationService.js'
import {Config} from '../../core/util/config.js'
import {create, select} from "../../core/util/Utils.js";
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

            translations.push(item.querySelector(".translate_definition").textContent)
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
        WordTranslationService.render(this.getTranslatedWord(),"#tab-academic", this.getLink())
    }

}

export {AcademicService}