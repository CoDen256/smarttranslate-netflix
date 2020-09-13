import {WordContextService} from '../WordContextService.js'
import {config} from '../../core/config.js'

const glosbeUrl = "https://{SOURCE}.glosbe.com/{SOURCE}/{TARGET}/{QUERY}"
const glosbeApi = glosbeUrl;

const params = {
	source: config.sourceLang,
	target: config.targetLang
}

class GlosbeService {
	constructor(extendedWord){
		this.service = new WordContextService(
			glosbeApi,
			params,
			extendedWord,
			this
		)
	}


	normalize(raw) {
		return raw.text()
	}

	parse(normalized){ // Array<Array<String, String>> - Array<Context<original, translation>>>
        let doc = new DOMParser().parseFromString(normalized, 'text/html')
        let contexts = []
        doc.querySelectorAll(".translate-example-text").forEach((example) => {
			let src = example.querySelector(".translate-example-source")
			let srcEm = src.querySelector(".translate-example-text-highlight")

			// Glosbe API probably returning fake translations, so there is no actual translations
			//let trg =  example.querySelector(".translate-example-target")
			//let trgEm = trg.querySelector(".translate-example-text-highlight")
			//trg.querySelector(".translate-example-text-origin-placeholder").remove()
			//trg.querySelector(".translate-example-text-origin-placeholder").remove()
			
			contexts.push([this.highlight(src, srcEm), ""])
        })
        return contexts;
	}

	getContextWord(){
		return this.service.getContextWord();
	}

	highlight(original, toHighlight){
		if (toHighlight == null) {
			return original.textContent.trim()
		}

		return original.textContent.trim().replace(toHighlight.textContent, `{{${toHighlight.textContent}}}`)
	}

}

export {GlosbeService, glosbeUrl}