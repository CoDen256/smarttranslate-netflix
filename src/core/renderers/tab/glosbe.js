import {GlosbeService, glosbeUrl} from "../../../services/concrete/GlosbeService.js";
import {URL} from "../../util/URL.js";
import {create, select} from "../../util/Utils.js";

class GlosbeRenderer {

    static render(translator) {
        let tab = select("#tab-glosbe")

        tab.querySelector("a").href = URL.replaceAll(glosbeUrl, GlosbeService.getParams())

        let content = tab.querySelector(".dictionary-content")
        content.innerHTML = ""
        translator.getGlosbeContexts().then((contexts) => {
            contexts.forEach((context) => {
                // <li class="dictionary-content-item">
                let item = create("li", "dictionary-content-item")
                let sent = this.emphasize(context.sentence)
                item.innerHTML = "🞄 " + sent + "<br><br>"
                content.appendChild(item)
            })
        })
    }

    static emphasize(sentence) {
        return sentence
            .replace("{{", "<span style='color:yellow'><em><strong>")
            .replace("}}", "</strong></em></span>");
    }

}

export {GlosbeRenderer}