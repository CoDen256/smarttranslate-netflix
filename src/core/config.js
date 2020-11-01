let lang_pack = {
    "en" : ["en", "english"],
    "de" : ["de", "german"]
}

// !!!!!!!!!!!!!!!!!
// http://www.omdbapi.com/?i=tt3896198&apikey=d432debb&s=The%20Big%20Bang%20Theory
// https://www.imdb.com/search/name/
let lang = lang_pack["en"]
let id = "0898266"

const config = {
    wordEditedId: "edited",
    hoverableWordClass: "hoverable",

    sourceLang: lang[0],
    targetLang: "ru",

    sourceLangFull: lang[1],
    targetLangFull: "russian",
    movie_id : id

}


const proxies = ["https://cors-anywhere2.herokuapp.com/", "https://cors-anywhere.herokuapp.com/",
    "https://cors-proxy.htmldriven.com/?url=", "https://thingproxy.freeboard.io/fetch/"]
const normalizationServices = [];
const textItemClass = '.player-timedtext';
const playerControlClass = '.PlayerControlsNeo__button-control-row'

export {textItemClass, playerControlClass, proxies, config}