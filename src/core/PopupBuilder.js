import {select} from './util/Utils.js'
import {TranslatorService} from "./TranslatorService.js";

class PopupBuilder {

    static activated = false;

    static initialize() {
        this.applyEventListeners();
        this.rendererProvider = null
        window.reloadPopup = this.reload
    }

    static createTranslationPopup(translator) {
        this.removeTranslationPopup()
        this.rendererProvider = translator.getExtended().getHeaderRendererClass();
        let headerRenderer = new this.rendererProvider(translator, select(".translation-header"));

        this.showTranslationPopup()
        // rendering all the stuff
        headerRenderer.render()
        translator.renderAllServices()

        this.activate("#tab-multitran", select("#button-multi"))
    }

    static reload(extended) {
        PopupBuilder.createTranslationPopup(new TranslatorService(extended))
    }


    static applyEventListeners() {
        select(".close-popup").addEventListener("click", (e) => this.removeTranslationPopup())
        let map = {
            "#button-multi": "#tab-multitran",
            "#button-pons": "#tab-pons",
            "#button-reverso": "#tab-reverso",
            "#button-academic": "#tab-academic",
            // "#button-glosbe": "#tab-glosbe",
            "#button-duden": "#tab-duden",
            "#button-wik": "#tab-wik",
        }
        for (const [key, value] of Object.entries(map)) {
            select(key).addEventListener("click", e => this.activate(value, e.target))
        }

    }

    static activate(id, button) {
        document.querySelectorAll(".section-full").forEach(e => e.style.display = "none")
        select(id).style.display = "block"

        document.querySelector(".tabs-row").querySelectorAll("button").forEach(b => {
            b.className = ""
        })
        button.className = "active"
    }

    static removeTranslationPopup() {
        if (!PopupBuilder.activated) return
        console.log("Hiding Translation Popup")
        this.setPopupVisibility("hidden")
        this.rendererProvider.disableExtra()
        this.activated = false
    }

    static showTranslationPopup() {
        let popup = select(".translation-popup")

        let clientHeight = window.innerHeight;
        let videoHeight = document.querySelector(".player-timedtext").clientHeight
        let offset = (clientHeight - videoHeight) / 2;

        popup.style.left = window.innerWidth / 2 - 200 + "px";
        popup.style.top = clientHeight - offset - videoHeight * 0.3 + "px"
        console.log("Showing Translation Popup")
        this.setPopupVisibility("visible")
        this.rendererProvider.enableExtra()
        this.activated = true
    }

    static setPopupVisibility(visibility) {
        this.setTranslationPopupVisibility(visibility)
        this.setRowVisibility(visibility)
        this.setScrollBarVisibility(visibility)
    }

    static async setTranslationPopupVisibility(visibility) {
        select(".translation-popup").style.visibility = visibility
    }

    static async setRowVisibility(visibility) {
        select(".tabs-row").style.visibility = visibility
    }

    static async setScrollBarVisibility(visibility) {
        select(".translation-scrollbar").style.visibility = visibility
    }

    static submit() {
        this.rendererProvider.submitNew()
    }

}

export {PopupBuilder};