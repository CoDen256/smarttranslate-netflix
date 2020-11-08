import {select} from './util/Utils.js'
import {TranslatorService} from "./TranslatorService.js";

class PopupBuilder {

    static activated = false;
    constructor() {
        this.applyEventListeners();
        this.rendererProvider = null
        window.reloadPopup = this.reload
    }

    createTranslationPopup(translator) {
        this.removeTranslationPopup()
        this.rendererProvider = translator.getExtended().getHeaderRendererClass();
        let headerRenderer = new this.rendererProvider(translator, select(".translation-header"));

        this.showTranslationPopup()
        // rendering all the stuff
        headerRenderer.render()
        translator.renderAllServices()

        this.activate("#tab-multitran", select("#button-multi"))
    }

    reload(extended) {
        let popup = new PopupBuilder()
        popup.createTranslationPopup(new TranslatorService(extended))
    }


    applyEventListeners() {
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

    activate(id, button) {
        document.querySelectorAll(".section-full").forEach(e => e.style.display = "none")
        select(id).style.display = "block"

        document.querySelector(".tabs-row").querySelectorAll("button").forEach(b => {
            b.className = ""
        })
        button.className = "active"
    }

    removeTranslationPopup() {
        if (!PopupBuilder.activated) return
        console.log("Hiding Translation Popup")
        this.setPopupVisibility("hidden")
        this.rendererProvider.disableExtra()
        PopupBuilder.activated = false
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
        PopupBuilder.activated = true
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

    submit() {
        this.rendererProvider.submitNew()
    }

}

export {PopupBuilder};