import {WiktionaryService} from './services/concrete/WiktionaryService.js'
import {GoogleService} from './services/concrete/GoogleService.js'
import {ReversoService} from './services/concrete/ReversoService.js'
import {MultitranService} from './services/concrete/MultitranService.js'
import {DudenService} from './services/concrete/DudenService.js';
import {GlosbeService} from './services/concrete/GlosbeService.js';
import {PonsService} from './services/concrete/PonsService.js'
import {SublemService} from './core/sublem/SubtitleLemmatizerService.js'

function test(extended) {
    const words = ["beobachtet", "Sprachen", "besser", "objektiven", "ausgehen", "Hündinnen"]
    const mainForms = ["beobachten", "Sprache", "gut", "objektiv", "ausgehen", "Hündin"]

    function testWik(word) {
        console.log("Testing Wiktionary Service")
        let service = new WiktionaryService(word)
        return service.getMeaningWord().then(word => {
            console.log("Parsed word from Wiktionary:", word);
            return word;
        })
    }

    function testGoogle(word) {
        console.log("Testing Google Sevice")

        let service = new GoogleService(word);
        service.getTranslatedWord().then((data) => {
            console.log("Translated from Google:", data)
        })
    }

    function testMultitran(word) {
        console.log("Testing Multitran Sevice")

        let service = new MultitranService(word);
        service.getTranslatedWord().then((data) => {
            console.log("Translated from Multitran:", data)
        })
    }

    function testPons(word) {
        console.log("Testing Pons Sevice")

        let service = new PonsService(word);
        service.getTranslatedWord().then((data) => {
            console.log("Translated from Pons:", data)
        })
    }

    function testReverso(word) {
        console.log("Testing Reverso Context Sevice")

        let service = new ReversoService(word);
        service.getContextWord().then((data) => {
            console.log("Context from Reverso:", data)
        })
    }

    function testGlosbe(word) {
        console.log("Testing Glosbe Sevice")

        let service = new GlosbeService(word);
        service.getContextWord().then((data) => {
            console.log("Context from Glosbe:", data)
        })
    }

    function testDuden(word) {
        console.log("Testing Duden Sevice")

        let service = new DudenService(word);
        service.getMeaningWord().then((data) => {
            console.log("Meaning from Duden:", data)
        })
    }

    function measure(func, word) {
        var t0 = performance.now()

        func(word)

        var t1 = performance.now()
        console.log("Call  took " + (t1 - t0) + " milliseconds.")
    }

    function testSublem() {
        let service = new SublemService(898266, 1, 1)

        service.getData().then(json => {
            console.log(json)
        })

    }

    //testDuden(extended);
    //testWik(extended)

    //testGoogle(extended);
    //testMultitran(extended)
    //testPons(extended)

    //testReverso(extended);
    //testGlosbe(extended);

    //testSublem()
}

export {test}