import {multitranUrl, params} from "../../../services/concrete/MultitranService.js";
import {URL} from "../../URL.js";

import {create, select} from "../../Utils.js";

class MultitranRenderer {

    static render(translator) {
        let tab = select("#tab-multitran")

        tab.querySelector("a").href = URL.replaceAll(multitranUrl, params)

        let content = tab.querySelector(".dictionary-content")
        content.innerHTML = ""
        translator.getMultitranTranslations().then((translations) => {
            translations.forEach((t) => {
                // <li class="dictionary-content-item">
                let item = create("li", "dictionary-content-item")
                item.textContent = t;
                content.appendChild(item)
            })
        })
    }

}

export {MultitranRenderer}