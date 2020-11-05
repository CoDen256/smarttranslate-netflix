import {Extension} from './Extension.js';
import {SublemService} from "./sublem/SubtitleLemmatizerService.js";
import {Config, playerControlClass, textItemClass} from './util/config.js'
import {MovieIdFinder} from "./warmup/MovieIdFinder.js";
import {TitleExtractor} from "./warmup/TitleExtractor.js";


async function fetchScript(id, season, episode) {
    if (Config.getLanguage() !== "de"){
        console.warn("Subtitle will not be fetched, since language is set to '"+Config.getLanguageFull()+"'")
        return null
    }
    let service = new SublemService(id, season, episode)
    let script = null;
    try {
        script = await service.getData();
        console.log("Subtitle script is fetched", script)
    } catch (e) {
        console.error("Failed to fetch subtitle script", e)
    }
    return script;
}

async function fetchInformation() {
    let extractor = new TitleExtractor()
    let {title, season, episode} = await extractor.extractMovieInfo()

    let finder = new MovieIdFinder(title)
    let id = await finder.getId()
    console.warn(`${title} ${id}, season:${season}, episode:${episode}`)

    return {season, episode, id};
}

async function main() {
    let settings = await Config.getSettings()
    console.log(settings)

    let {season, episode, id} = await fetchInformation(settings);
    let script = await fetchScript(id, season, episode);

    let extension = new Extension(script);
    setInterval(function () {

        let targetItem = document.querySelector(textItemClass);
        if (targetItem && document.querySelector(playerControlClass)) {
            if (!extension.launched) {
                extension.start(targetItem);
            }
        } else {
            extension.launched = false;
        }
    }, 1000);
}

// let netflixSubtitleNavigator = new NetflixNavigator();


// setTimeout(() => netflixSubtitleNavigator.update(0), 5000)
main()
/*
import {test} from './test.js';
import {Substantiv, Verb} from "./services/entities.js";
import {ExtendedWord} from "./services/entities.js";

test(createExtended())

function createExtended() {
	let extendedWord = new ExtendedWord("gibt");
	extendedWord.mainForm = "geben";
	extendedWord.pos = new Verb("V", "aus", true);

	//let extendedWord = new ExtendedWord("Pizzen")
	//extendedWord.mainForm = "Pizza";
	//extendedWord.pos = new Substantiv("NN")
	return extendedWord
}
*/

