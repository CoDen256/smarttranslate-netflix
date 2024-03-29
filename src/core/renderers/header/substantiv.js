import {ExtendedWord, Substantiv} from "../../../services/entities.js";
import {select} from "../../util/Utils.js";

class SubstantivRenderer {
    constructor(translator, header) {
        this.translator = translator;
        this.header = header
    }

    static submitNew() {
        let input = select("#word").value
        let newWord = new ExtendedWord(input);

        newWord.pos = new Substantiv("NN", null)

        window.reloadPopup(newWord)
    }

    static enableExtra() {
        select("#gender").style.visibility = "visible"
        select("#gender").style.position = "relative"
        select("#gender-label").style.visibility = "visible"
    }

    static disableExtra() {
        select("#gender").style.visibility = "hidden"
        select("#gender").style.position = "absolute"
        select("#gender-label").textContent = "(?)"
        select("#gender-label").style.visibility = "hidden"
    }

    render() {
        window.submitNewSubstantiv = SubstantivRenderer.submitNew

        let genderLabel = this.header.querySelector("#gender-label")
        this.translator.getGender().then(gender => {
            if (gender != null) {
                genderLabel.textContent = gender.toString();
            }
        })


        let wordInput = this.header.querySelector("#word")
        wordInput.value = this.translator.getMainForm();

        let searchButton = this.header.querySelector("#search-btn")
        searchButton.onclick = submitNewSubstantiv
    }

    getInfo() {
        return "substantiv"
    }
}

export {SubstantivRenderer}