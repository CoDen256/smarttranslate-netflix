import {ExtendedWord, Substantiv} from "../../../services/entities.js";

class SubstantivRenderer {
    constructor(translator, header) {
        this.translator = translator;
        this.header = header
    }

    render(){
        window.submitNewSubstantiv = this.submitNewSubstantiv

        let genderLabel = this.header.querySelector("#gender-label")
        this.translator.getGender().then(gender => {
            genderLabel.textContent = gender.toString();
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
        let input = document.querySelector("#word").value
        let newWord = new ExtendedWord(input);

        newWord.pos = new Substantiv("NN", null)

        window.reloadPopup(newWord)
    }

    static enableExtra() {
        document.querySelector("#gender").style.visibility = "visible"
        document.querySelector("#gender").style.position = "relative"
    }

    static disableExtra() {
        document.querySelector("#gender").style.visibility = "hidden"
        document.querySelector("#gender").style.position = "absolute"
        document.querySelector("#gender-label").textContent = "(?)"
    }
}

export {SubstantivRenderer}