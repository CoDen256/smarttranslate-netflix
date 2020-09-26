import {ExtendedWord, SimplePartOfSpeech} from "../../../services/entities.js";
import {select} from "../../Utils.js";

class DefaultRenderer{
    constructor(translator, header) {
        this.translator = translator;
        this.header = header
    }

    render() {
        window.submitNewWord = this.submitNewWord

        let wordInput = this.header.querySelector("#word")
        wordInput.value = this.translator.getMainForm();

        let searchButton = this.header.querySelector("#search-btn")
        searchButton.onclick = submitNewWord
    }


    getInfo() {
        return "substantiv"
    }

    submitNewWord() {
        let input = select("#word").value
        let newWord = new ExtendedWord(input);

        newWord.pos = new SimplePartOfSpeech("NONE")

        window.reloadPopup(newWord)
    }

    static enableExtra() {
    }

    static disableExtra() {
    }
}

export {DefaultRenderer}