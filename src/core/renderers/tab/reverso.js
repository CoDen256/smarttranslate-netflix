import {reversoUrl, params} from "../../../services/concrete/ReversoService.js";
import {URL} from "../../URL.js";
import {select, create} from "../../Utils.js";

class ReversoRenderer{

    static render(translator){
        let tab = select("#tab-reverso")

        tab.querySelector("a").href = URL.replaceAll(reversoUrl, params)

        let content = tab.querySelector(".dictionary-content")

        content.innerHTML = ""
        translator.getReversoContexts().then((contexts) => {
            contexts.forEach((context) => {
                // <li class="dictionary-content-item">
                let item = create("li", "dictionary-content-item")
                let sent = this.emphasize(context.sentence)
                let translation = this.emphasize(context.translation)

                item.innerHTML =  "🞄 " + sent + "<br>🞄 " + translation +"<br><br>"
                content.appendChild(item)
            })
        })
    }

    static emphasize(sentence){
        return sentence
            .replace("{{", "<span style='color:yellow'><em><strong>")
            .replace("}}", "</strong></em></span>");
    }

}

export {ReversoRenderer}