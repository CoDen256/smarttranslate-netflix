const config = {
	popupWidth : 270,
	popupTop: 510,
	activationOpacity : "0.95",
	popupClass : "translation-popup",
	
	closePopupClass : "close-popup",

	scrollBarHeight : 381,
	translationScrollBarClass: "translation-scrollbar",
	translationPanelClass: "translation-panel",

	headerClass : "translation-header",
	headerSectionClass : "translation-header-section",

	fullSectionClass: "section-full",

	externalDictsClass: "external-dicts-row",
	externalDictsContainerClass: "external-dicts-container",

	wordEditedId : "edited",
	hoverableWordClass :"hoverable",

	sourceLang : "de",
	targetLang : "ru",

	sourceLangFull: "german",
	targetLangFull : "russian"

}


const proxies = ["https://cors-anywhere.herokuapp.com/", "https://cors-proxy.htmldriven.com/?url="]
const normalizationServices = [];
const textItemClass = '.player-timedtext';
const playerControlClass = '.PlayerControlsNeo__button-control-row'
const maxWidth = document.body.clientWidth

export {textItemClass, playerControlClass, maxWidth, proxies, config}