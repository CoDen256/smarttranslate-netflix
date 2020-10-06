import {params, ponsUrl} from "../../../services/concrete/PonsService.js";
import {URL} from "../../URL.js";
import {create, select} from "../../Utils.js";

class PonsRenderer {

    static render(translator) {
        let tab = select("#tab-pons")

        tab.querySelector("a").href = URL.replaceAll(ponsUrl, params)

        let content = tab.querySelector(".dictionary-content")
        content.innerHTML = ""
        translator.getPonsTranslations().then((translations) => {
            translations.forEach((t) => {
                // <li class="dictionary-content-item">
                let item = create("li", "dictionary-content-item")
                item.textContent = t;
                content.appendChild(item)
            })
        })
    }

}

export {PonsRenderer}