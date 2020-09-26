import {ExtendedWord, Substantiv} from "../../../services/entities.js";
import {select} from "../../Utils.js";

class SubstantivRenderer {
    constructor(translator, header) {
        this.translator = translator;
        this.header = header
    }

    render(){
        window.submitNewSubstantiv = this.submitNewSubstantiv

        let genderLabel = this.header.querySelector("#gender-label")
        this.translator.getGender().then(gender => {
            if (gender != null){
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

    submitNewSubstantiv() {
        let input = select("#word").value
        let newWord = new ExtendedWord(input);

        newWord.pos = new Substantiv("NN", null)

        window.reloadPopup(newWord)
    }

    static enableExtra() {
        select("#gender").style.visibility = "visible"
        select("#gender").style.position = "relative"
    }

    static disableExtra() {
        select("#gender").style.visibility = "hidden"
        select("#gender").style.position = "absolute"
        select("#gender-label").textContent = "(?)"
    }
}

export {SubstantivRenderer}