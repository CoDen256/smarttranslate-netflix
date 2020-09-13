import {PopupBuilder} from './core/PopupBuilder.js';
import {Extension} from './core/Extension.js';
import {SublemService} from "./services/concrete/SubtitleLemmatizerService.js";
import {TimedSubtitleProvider} from "./core/TimedSubtitleProvider.js";
import {textItemClass, playerControlClass} from './core/config.js'
import {timeOfSeconds} from './core/Utils.js'


async function main() {
	console.log("Loading subtitle script...")
	let service = new SublemService(898266, 1, 1)
	let script = await service.getData();
	console.log("Subtitle script is loaded, starting Extension...", script)

	let extension = new Extension(new PopupBuilder(), script);

	let provider = new TimedSubtitleProvider(script)
	var el = document.querySelector("#button-multi")
	var i = 0;
	var interval = setInterval(function() {
		return
		if (document.querySelectorAll('video')[0] === undefined) return
		el.style.visibility = "visible";
		let duration = document.querySelectorAll('video')[0].currentTime
		el.textContent = timeOfSeconds(duration)
		return
		let sub =  provider.getSubtitleByTime(timeOfSeconds(duration))
		if (sub == null) return
		let line = ""
		sub.lemmas.forEach(l => {
			line += l.original + " ";
		})
		//console.log("[SUBTITLE]", sub.start, line, ":", sub.start, "<", el.textContent, "<", sub.end)

		if (i > 10) {
			clearInterval(interval);
		}
	}, 100);

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
