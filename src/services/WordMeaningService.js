import {AbstractService} from './AbstractService.js'
import {MeaningWord} from './entities.js'
import {create, displayFailMessage, select} from "../core/util/Utils.js";

class WordMeaningService {
    constructor(apiUrl, params, extendedWord, client) {
        this.abstractService = new AbstractService(
            apiUrl,
            params,
            extendedWord,
            client,
            this
        )
    }

    getMeaningWord() {
        return this.abstractService.getWord();
    }

    toSpecifiedWord(extendedWord) {
        return new MeaningWord(extendedWord)
    }

    mapToString(meaningWord) {
        let extended = meaningWord.extendedWord
        return extended.prepareToMeaning(extended.mainForm)
    }

    onResult(meaningWord, result) {
        return meaningWord.addMeanings(result)
    }

    static render(meaningWord, id, link) {
        let tab = select(id)

        tab.querySelector("a").href = link

        let content = tab.querySelector(".dictionary-content")
        content.innerHTML = ""

        meaningWord
            .then(word => word.getMeanings())
            .then(meanings => WordMeaningService.displayMeanings(content, meanings))
    }

    static displayMeanings(content, meanings) {
        if (meanings.length === 0){
            displayFailMessage(content);
            return
        }
        meanings.forEach((meaningItem) => {
            let item = create("li", "dictionary-content-item")
            item.innerHTML = meaningItem.innerHTML;
            content.appendChild(item)
        })

    }
}

export {WordMeaningService};