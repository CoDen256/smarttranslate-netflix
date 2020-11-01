import {PopupBuilder} from './core/PopupBuilder.js';
import {Extension} from './core/Extension.js';
import {SublemService} from "./services/concrete/SubtitleLemmatizerService.js";
import {LTCProvider} from "./core/player/LTCProvider.js";
import {config, playerControlClass, textItemClass} from './core/config.js'
import {timeOfSeconds} from './core/Utils.js'
import {NetflixPlayer} from "./core/player/Player.js";
import {MovieIdFinder} from "./services/concrete/MovieIdFinder.js";
import {TitleExtractor} from "./core/player/TitleExtractor.js";


async function main() {

    let extractor = new TitleExtractor()
    let {title, season, episode} = await extractor.extract()

    let finder = new MovieIdFinder(title)
    let id = await finder.getId()
    console.log(`${title} ${id}, season:${season}, episode:${episode}`)

    let netflixPlayer = new NetflixPlayer()
    netflixPlayer.pause()
    let service = new SublemService(id, season, episode)
    let script;
    try {
        script = await service.getData();
        console.log("Subtitle script is loaded, starting Extension...", script)
    } catch (e) {
        console.error("Failed to load subtitle script", e)
    }
    netflixPlayer.play()

    let extension = new Extension(new PopupBuilder(), netflixPlayer, script);
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

// let netflixSubtitleNavigator = new NetflixSubtitleNavigator();


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

