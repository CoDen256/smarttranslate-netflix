import {PopupBuilder} from './core/PopupBuilder.js';
import {Extension} from './core/Extension.js';
import {SublemService} from "./services/concrete/SubtitleLemmatizerService.js";
import {TimedSubtitleProvider} from "./core/TimedSubtitleProvider.js";
import {textItemClass, playerControlClass} from './core/config.js'


async function main() {
	console.log("Loading subtitle script...")
	let service = new SublemService(898266, 1, 1)
	let script = await service.getData();
	console.log("Subtitle script is loaded, starting SubtitleProvider and Extension...", script)


	let subtitleProvider = new TimedSubtitleProvider(script);
	let extension = new Extension(new PopupBuilder(), subtitleProvider);

	setInterval(function () {

		let newItem = document.querySelector(textItemClass);
		if (newItem && document.querySelector(playerControlClass)) {

			if (!extension.launched) {
				subtitleProvider.update(getCurrentTime())
				extension.update(newItem);
			}

		} else {
			extension.launched = false;
		}


	}, 1000);
}

function getCurrentTime() {
	let time = document.querySelector(".scrubber-bar")
		.querySelector(".scrubber-head")
		.getAttribute("aria-valuetext")
	let scrubber = time.split(" ")

	return {current:scrubber[0], total:scrubber[2]}
}

 
main()

//import {test} from './test.js';
//test("STÖHNT")
