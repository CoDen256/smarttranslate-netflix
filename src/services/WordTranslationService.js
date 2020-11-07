import {AbstractService} from './AbstractService.js'
import {TranslatedWord} from './entities.js'
import {create, displayFailMessage, select} from "../core/util/Utils.js";

class WordTranslationService {
    constructor(apiUrl, params, extendedWord, client) {
        this.abstractService = new AbstractService(
            apiUrl,
            params,
            extendedWord,
            client,
            this
        )
    }

    getTranslatedWord() {
        return this.abstractService.getWord();
    }

    toSpecifiedWord(extendedWord) {
        return new TranslatedWord(extendedWord)
    }

    mapToString(translatedWord) {
        let extended = translatedWord.extendedWord
        return extended.prepareToTranslation(extended.mainForm)
    }

    onResult(translatedWord, result) {
        return translatedWord.addTranslations(result)
    }


    static render(translatedWord, id, link) {
        let tab = select(id)

        tab.querySelector("a").href = link

        let content = tab.querySelector(".dictionary-content")
        content.innerHTML = ""

        translatedWord
            .then((word) => word.getTranslations())
            .then((translations) => WordTranslationService.displayTranslations(content, translations))
    }

    static displayTranslations(content, translations){
        if (translations.length === 0) {
            displayFailMessage(content);
            return
        }
        translations.forEach((translation) => {
            let item = create("li", "dictionary-content-item")
            item.textContent = translation;
            content.appendChild(item)
        })
    }
}

export {WordTranslationService};