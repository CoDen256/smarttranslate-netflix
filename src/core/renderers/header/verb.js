import {ExtendedWord, Verb} from "../../../services/entities.js";
import {select} from "../../util/Utils.js";

class VerbRenderer {
    constructor(translator, header) {
        this.translator = translator;
        this.header = header
    }

    static submitNew() {
        let checked = select("#reflex").checked
        let input = select("#word").value

        let newWord = new ExtendedWord(input);
        newWord.pos = new Verb("V", null, checked)
        window.reloadPopup(newWord)
    }

    static enableExtra() {
        select("#reflex-input").style.visibility = "visible"
        select("#reflex").style.visibility = "visible"
        select("#reflex-label").style.visibility = "visible"
        select("#reflex-input").style.position = "relative"
    }

    static disableExtra() {
        select("#reflex-input").style.position = "absolute"
        select("#reflex-input").style.visibility = "hidden"
        select("#reflex").style.visibility = "hidden"
        select("#reflex-label").style.visibility = "hidden"
    }

    render() {
        window.submitNewVerb = VerbRenderer.submitNew
        window.reflexChanged = this.reflexChanged

        this.changeReflex(this.translator.isReflex())

        let reflexCheckbox = this.header.querySelector("#reflex")
        reflexCheckbox.onchange = reflexChanged

        let wordInput = this.header.querySelector("#word")
        wordInput.value = (this.translator.getPrefix() || "") + this.translator.getMainForm()

        let searchButton = this.header.querySelector("#search-btn")
        searchButton.onclick = submitNewVerb
    }

    getInfo() {
        return this.translator.isReflex() ? "refl." : ""
    }

    reflexChanged() {
        let checked = select("#reflex").checked
        select("#reflex-label").style.visibility = checked ? "visible" : "hidden"
    }

    changeReflex(isReflex) {
        isReflex = isReflex === true;
        select("#reflex").checked = isReflex
        select("#reflex-label").style.visibility = isReflex ? "visible" : "hidden"
    }
}

export {VerbRenderer}