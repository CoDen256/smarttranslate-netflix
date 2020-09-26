import {dudenUrl, params} from "../../../services/concrete/DudenService.js";
import {URL} from "../../URL.js";
import {select, create} from "../../Utils.js";

class DudenRenderer {

    static render(translator) {
        let tab = select("#tab-duden")

        tab.querySelector("a").href = URL.replaceAll(dudenUrl, params)

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