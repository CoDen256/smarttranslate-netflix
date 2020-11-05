import {ExtendedWord, SimplePartOfSpeech} from "../../../services/entities.js";
import {select} from "../../util/Utils.js";

class DefaultRenderer {
    constructor(translator, header) {
        this.translator = translator;
        this.header = header
    }

    static submitNew() {
        let input = select("#word").value
        let newWord = new ExtendedWord(input);

        newWord.pos = new SimplePartOfSpeech("NONE")

        window.reloadPopup(newWord)
    }

    static enableExtra() {
    }

    static disableExtra() {
    }

    render() {
        window.submitNewWord = DefaultRenderer.submitNew

        let wordInput = this.header.querySelector("#word")
        wordInput.value = this.translator.getMainForm();

        let searchButton = this.header.querySelector("#search-btn")
        searchButton.onclick = submitNewWord
    }

    getInfo() {
        return "substantiv"
    }
}

export {DefaultRenderer}