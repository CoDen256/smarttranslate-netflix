import {_Url, params} from "../../../services/concrete/_Service.js";
import {URL} from "../../URL.js";
import {select, create} from "../../Utils.js";

class _Renderer{

    static render(translator){
        let tab = select("#tab-_")

        tab.querySelector("a").href = URL.replaceAll(_Url, params)

        let content = tab.querySelector(".dictionary-content")
        translator.get_<>s().then((<>s) => {
            <>s.forEach((<>) => {
                // <li class="dictionary-content-item">
                let item = create("li", "dictionary-content-item")
                item.textContent = <>;
                content.appendChild(item)
            })
        })
    }

}

export {_Renderer}