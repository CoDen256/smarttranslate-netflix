import {MeaningWord, Substantiv} from '../entities.js'
import {Config} from '../../core/util/config.js'
import {WordMeaningService} from "../WordMeaningService.js";
import {create, displayFailMessage, emphasize, select} from "../../core/util/Utils.js";
import {URL} from "../../core/util/URL.js";

const wiktionaryURL = "https://{SOURCE}.wiktionary.org/wiki/{QUERY}";
const wiktionaryApi = "https://{SOURCE}.wiktionary.org/w/index.php?action=raw&title={QUERY}";

// TODO english wiki
class WiktionaryService {

    constructor(extendedWord) {
        this.service = this.createService(extendedWord)
        this.extendedWord = extendedWord
    }

    createService(extendedWord) {
        if (this.isUnsupported()) {
            console.warn("WIKTIONARY.ORG IS DISABLED")
            return null
        }
        return new WordMeaningService(
            wiktionaryURL,
            WiktionaryService.generateParams(),
            extendedWord,
            this)
    }


    normalize(raw) {
        return raw.text()
    }

    parse(normalized) { // => Array<String> - meanings
        let items = [];
        let doc = new DOMParser().parseFromString(normalized, 'text/html')

        let children = doc.querySelector("#mw-content-text")
            .querySelector(".mw-parser-output")
            .children

        for (let child of children){
            if (child.tagName === "P"){
                child.innerHTML = emphasize("{{"+child.innerHTML+"}}")
                items.push(child)
            }
            if (child.tagName === "DL"){
                items.push(child)
            }
        }

        items.pop()
        this.parsed_gender = this.parseGender(doc);
        return items
    }


    getMeaningWord() {
        if (this.isUnsupported()) {
            return Promise.resolve(new MeaningWord(this.extendedWord))
        }
        return this.service.getMeaningWord().then(meaningWord => this.applyGender(meaningWord));
    }

    parseGender(doc) {
        let gender = null
        try{
            gender = doc
                .querySelector("#mw-content-text")
                .querySelector("h3")
                .querySelector(".mw-headline")
                .querySelector("em")
                .textContent
            if (!["f", "m", "n"].includes(gender)) return null;
        }catch (e){}

        return gender
    }

    applyGender(meaningWord) {
        let pos = meaningWord.extendedWord.pos
        if (pos instanceof Substantiv) {
            pos.gender = this.parsed_gender
        }
        return meaningWord
    }

    static generateParams() {
        return {source: Config.getLanguage()}
    }

    isUnsupported() {
        return Config.getLanguage() !== "de"
    }

    getLink(){
        if (this.isUnsupported()){
            let fakeParams = WiktionaryService.generateParams()
            fakeParams.query = ""
            return URL.replaceAll(wiktionaryURL, fakeParams)
        }
        return URL.replaceAll(wiktionaryURL, this.service.abstractService.getParams())
    }

    render() {
        WordMeaningService.render(this.getMeaningWord(), "#tab-wik", this.getLink())
    }
}

export {WiktionaryService};