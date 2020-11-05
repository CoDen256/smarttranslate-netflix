import {waitFor} from "./Utils.js";

let lang_pack = {
    "en" : ["en", "english"],
    "de" : ["de", "german"]
}

// !!!!!!!!!!!!!!!!!
// http://www.omdbapi.com/?i=tt3896198&apikey=d432debb&s=The%20Big%20Bang%20Theory
// https://www.imdb.com/search/name/
let lang = lang_pack["en"]
let id = "0898266"

let config = {
    wordEditedId: "edited",
    hoverableWordClass: "hoverable",

    sourceLang: lang[0],
    targetLang: "ru",

    sourceLangFull: lang[1],
    targetLangFull: "russian",
    movie_id : id

}

class Config {
    static async getSettings(){
        await waitFor(() => !(this.getCurrentSettings() == null))
        return this.getCurrentSettings();
    }

    static getCurrentSettings(){
        let popup = document.getElementById("nest-popup");
        if (popup == null) return null
        return this.extractSettings(popup)
    }

    static extractSettings(element){
        let result = {
            default_id:       element.getAttribute("imdb-id"),
            language:   element.getAttribute("language")
        }
        if(Object.values(result).some(v => v == null)){
            return null;
        }
        return result
    }
}

const proxies = ["https://cors-anywhere2.herokuapp.com/", "https://cors-anywhere.herokuapp.com/",
    "https://cors-proxy.htmldriven.com/?url=", "https://thingproxy.freeboard.io/fetch/"]
const normalizationServices = [];
const textItemClass = '.player-timedtext';
const playerControlClass = '.PlayerControlsNeo__button-control-row'

export {textItemClass, playerControlClass, proxies, config, lang_pack, Config}