const config = {
    wordEditedId: "edited",
    hoverableWordClass: "hoverable",

    sourceLang: "de",
    targetLang: "ru",

    sourceLangFull: "german",
    targetLangFull: "russian"

}


const proxies = ["https://cors-anywhere.herokuapp.com/",
    "https://cors-anywhere2.herokuapp.com/"]
const normalizationServices = [];
const textItemClass = '.player-timedtext';
const playerControlClass = '.PlayerControlsNeo__button-control-row'

export {textItemClass, playerControlClass, proxies, config}