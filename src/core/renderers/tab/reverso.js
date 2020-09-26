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
                item.textContent = context;
                content.appendChild(item)
            })
        })
    }

}

export {ReversoRenderer}