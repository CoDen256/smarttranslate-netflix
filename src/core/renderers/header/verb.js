import {ExtendedWord, Verb} from "../../../services/entities.js";

class VerbRenderer{
    constructor(translator, header) {
        this.translator = translator;
        this.header = header
    }


    render() {
        window.submitNewVerb = this.submitNewVerb
        window.reflexChanged = this.reflexChanged

        this.changeReflex(this.translator.isReflex())

        let reflexCheckbox = this.header.querySelector("#reflex")
        reflexCheckbox.onchange = reflexChanged

        let wordInput = this.header.querySelector("#word")
        wordInput.value = (this.translator.getPrefix() || "") +this.translator.getMainForm()

        let searchButton = this.header.querySelector("#search-btn")
        searchButton.onclick = submitNewVerb
    }

    getInfo() {
        return this.translator.isReflex() ? "refl." : ""
    }

    reflexChanged() {
        let checked = document.querySelector("#reflex").checked
        document.querySelector("#reflex-label").style.visibility = checked ? "visible" : "hidden"
    }

    changeReflex(isReflex) {
        isReflex = isReflex === true;
        document.querySelector("#reflex").checked = isReflex
        document.querySelector("#reflex-label").style.visibility = isReflex ? "visible" : "hidden"
    }

    submitNewVerb() {
        let checked = document.querySelector("#reflex").checked
        let input = document.querySelector("#word").value

        let newWord = new ExtendedWord(input);
        newWord.pos = new Verb("V", null, checked)
        window.reloadPopup(newWord)
    }

    static enableExtra() {
        document.querySelector("#reflex-input").style.visibility = "visible"
        document.querySelector("#reflex").style.visibility = "visible"
        document.querySelector("#reflex-label").style.visibility = "visible"
        document.querySelector("#reflex-input").style.position = "relative"
    }

    static disableExtra() {
        document.querySelector("#reflex-input").style.visibility = "hidden"
        document.querySelector("#reflex").style.visibility = "hidden"
        document.querySelector("#reflex-label").style.visibility = "hidden"
        document.querySelector("#reflex-input").style.position = "absolute"
    }
}

export {VerbRenderer}