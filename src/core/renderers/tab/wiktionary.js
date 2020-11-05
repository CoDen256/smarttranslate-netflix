import {WiktionaryService, wiktionaryURL} from "../../../services/concrete/WiktionaryService.js";
import {URL} from "../../util/URL.js";
import {create, select} from "../../util/Utils.js";

class WikiRenderer {

    static render(translator) {
        let tab = select("#tab-wik")

        tab.querySelector("a").href = URL.replaceAll(wiktionaryURL, WiktionaryService.getParams())

        let content = tab.querySelector(".dictionary-content")
        content.innerHTML = ""
        translator.getWikiMeanings().then((meanings) => {
            meanings.forEach((meaning) => {
                // <li class="dictionary-content-item">
                let item = create("li", "dictionary-content-item")
                item.innerHTML = "🞄 " + meaning;
                content.appendChild(item)
            })
        })
    }

}

export {WikiRenderer}