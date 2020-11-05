import {select} from './util/Utils.js'
import {Translator} from "./Translator.js";
import {GoogleRenderer} from "./renderers/header/google.js";
import {DudenService} from "../services/concrete/DudenService.js";
import {WiktionaryService} from "../services/concrete/WiktionaryService.js";
import {GlosbeService} from "../services/concrete/GlosbeService.js";
import {ReversoService} from "../services/concrete/ReversoService.js";
import {PonsService} from "../services/concrete/PonsService.js";
import {MultitranService} from "../services/concrete/MultitranService.js";

class PopupBuilder {

    constructor() {
        this.applyEventListeners();
        window.reloadPopup = this.reload
    }

    createTranslationPopup(translator) {
        this.translator = translator;
        this.rendererProvider = translator.getExtended().getHeaderRendererClass();
        let headerRenderer = new this.rendererProvider(translator, select(".translation-header"));
        this.removeTranslationPopup()
        this.showTranslationPopup()

        // rendering all the stuff
        GoogleRenderer.render(translator) // the simple translation from google
        headerRenderer.render()
        this.fillTabs();
        this.activate("#tab-multitran", select("#button-multi"))
    }

    reload(extended) {
        let popup = new PopupBuilder()
        popup.createTranslationPopup(new Translator(extended))
    }


    applyEventListeners() {
        select(".close-popup").addEventListener("click", (e) => this.removeTranslationPopup())
        let map = {
            "#button-multi": "#tab-multitran",
            "#button-pons": "#tab-pons",
            "#button-reverso": "#tab-reverso",
            "#button-glosbe": "#tab-glosbe",
            "#button-duden": "#tab-duden",
            "#button-wik": "#tab-wik",
        }
        for (const [key, value] of Object.entries(map)) {
            select(key).addEventListener("click", e => this.activate(value, e.target))
        }

    }


    activate(id, button) {
        document.querySelectorAll(".section-full").forEach(e => e.style.display = "none")
        select(id).style.display = "block"

        document.querySelector(".tabs-row").querySelectorAll("button").forEach(b => {
            b.className = ""
        })
        button.className = "active"
    }


    fillTabs() {
        MultitranService.render(this.translator.multitran);
        PonsService.render(this.translator.pons)
        ReversoService.render(this.translator.reverso)
        GlosbeService.render(this.translator.glosbe)
        DudenService.render(this.translator.duden)
        WiktionaryService.render(this.translator.wiktionary)
    }

    removeTranslationPopup() {
        console.log("Hiding Translation Popup")
        this.setPopupVisibility("hidden")
        this.rendererProvider.disableExtra()
    }

    showTranslationPopup() {
        let popup = select(".translation-popup")

        let clientHeight = window.innerHeight;
        let videoHeight = document.querySelector(".player-timedtext").clientHeight
        let offset = (clientHeight - videoHeight) / 2;

        popup.style.left = window.innerWidth / 2 - 200 + "px";
        popup.style.top = clientHeight - offset - videoHeight * 0.3 + "px"
        console.log("Showing Translation Popup")
        this.setPopupVisibility("visible")
        this.rendererProvider.enableExtra()
    }

    setPopupVisibility(visibility) {
        this.setTranslationPopupVisibility(visibility)
        this.setRowVisibility(visibility)
        this.setScrollBarVisibility(visibility)
    }

    async setTranslationPopupVisibility(visibility) {
        select(".translation-popup").style.visibility = visibility
    }

    async setRowVisibility(visibility) {
        select(".tabs-row").style.visibility = visibility
    }

    async setScrollBarVisibility(visibility) {
        select(".translation-scrollbar").style.visibility = visibility
    }

    onEnter() {
        this.rendererProvider.submitNew()
    }
}

export {PopupBuilder};