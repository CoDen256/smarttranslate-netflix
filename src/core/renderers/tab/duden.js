import {DudenService, dudenUrl} from "../../../services/concrete/DudenService.js";
import {URL} from "../../util/URL.js";
import {create, select} from "../../util/Utils.js";

class DudenRenderer {

    static render(translator) {
        let tab = select("#tab-duden")

        tab.querySelector("a").href = URL.replaceAll(dudenUrl, DudenService.getParams())

        let content = tab.querySelector(".dictionary-content")
        content.innerHTML = ""
        translator.getDudenMeanings().then((meanings) => {
            meanings.forEach((meaning) => {
                // <li class="dictionary-content-item">
                let item = create("li", "dictionary-content-item")
                item.innerHTML = "🞄 " + meaning;
                content.appendChild(item)
            })
        })
    }

}

export {DudenRenderer}