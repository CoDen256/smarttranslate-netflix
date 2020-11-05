import {select} from "../../util/Utils.js";

class GoogleRenderer {
    static render(translator) {
        let short_translation = select("#short-translation")
        short_translation.textContent = "[loading]"
        short_translation.style.color = "white"
        short_translation.style.fontWeight = "normal"

        translator.simpleTranslate().then(translate => {
            short_translation.textContent = translate
            short_translation.style.color = "yellow"
            short_translation.style.fontWeight = "bold"
        })
    }
}

export {GoogleRenderer};
