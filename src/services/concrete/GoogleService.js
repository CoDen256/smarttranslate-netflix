import {Config} from '../../core/util/config.js'
import {WordTranslationService} from '../WordTranslationService.js'
import {select} from "../../core/util/Utils.js";

//TODO: MAYBE USE THIS ONE INSTEAD OF API TOO
const googleURL = "https://translate.google.com/?hl=de#view=home&op=translate&sl={SOURCE}&tl={TARGET}&text={QUERY}"
const googleApi = "https://translate.googleapis.com/translate_a/single?client=gtx&sl={SOURCE}&tl={TARGET}&dt=t&q={QUERY}";


class GoogleService {
    constructor(extendedWord) {
        this.service = new WordTranslationService(
            googleApi,
            GoogleService.generateParams(),
            extendedWord,
            this
        )
    }

    normalize(raw) {
        return raw.json()
    }

    parse(normalized) {
        return [normalized[0][0][0]];
    }

    getTranslatedWord() {
        return this.service.getTranslatedWord();
    }

    static generateParams(){
        return {
            source: Config.getLanguage(),
            target: Config.getTargetLanguage()
        }
    }

    getLink(){
        return URL.replaceAll(googleURL, this.service.abstractService.getParams())
    }

    render() {
        let short_translation = select("#short-translation")
        short_translation.textContent = "[loading]"
        short_translation.style.color = "white"
        short_translation.style.fontWeight = "normal"

        this.getTranslatedWord()
            .then((word) => word.getTranslations().join(", "))
            .then(translate => {
            short_translation.textContent = translate
            short_translation.style.color = "yellow"
            short_translation.style.fontWeight = "bold"
        })
    }
}

export {GoogleService};