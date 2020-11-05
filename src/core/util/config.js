import {waitFor} from "./Utils.js";

// FOR FINDING THE ID OF A MOVIE
// http://www.omdbapi.com/?i=tt3896198&apikey=d432debb&s=The%20Big%20Bang%20Theory
// OR
// https://www.imdb.com/search/name/

class Language{
    static lang_pack = {
        "en" : ["en", "english"],
        "ru" : ["ru", "russian"],
        "de" : ["de", "german"]
    }

    static of(alias){
        return this.lang_pack[alias][0]
    }
    static full(alias){
        return this.lang_pack[alias][1]
    }

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
        if(Object.values(result).some(v => v == null)) return null;
        return result
    }

    static getLanguage(){
        return Language.of(this.getCurrentSettings().language)
    }

    static getLanguageFull(){
        return Language.full(this.getCurrentSettings().language)
    }

    static getTargetLanguage(){
        return Language.of("ru")
    }

    static getTargetLanguageFull(){
        return Language.full("ru")
    }
}

const proxies = [
    "https://cors-anywhere2.herokuapp.com/",
    "https://cors-anywhere.herokuapp.com/",
    "https://cors-proxy.htmldriven.com/?url=",
    "https://thingproxy.freeboard.io/fetch/"
]

const wordEditedId = "edited"
const hoverableWordClass = "hoverable"
const textItemClass = '.player-timedtext';
const playerControlClass = '.PlayerControlsNeo__button-control-row'

export {textItemClass, playerControlClass, proxies, wordEditedId, hoverableWordClass, Config}