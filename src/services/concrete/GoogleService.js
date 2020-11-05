import {Config} from '../../core/util/config.js'
import {WordTranslationService} from '../WordTranslationService.js'

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
}

export {GoogleService};