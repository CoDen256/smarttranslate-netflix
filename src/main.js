import {PopupBuilder} from './core/PopupBuilder.js';
import {Extension} from './core/Extension.js';
import {textItemClass, playerControlClass} from './core/config.js'


function main(){

	let extension = new Extension(new PopupBuilder());

	setInterval(function(){

		let newItem = document.querySelector(textItemClass);
	
		if(newItem && document.querySelector(playerControlClass)){

			if(!extension.launched) extension.update(newItem);
	
		}else {
			extension.launched = false;	
		}
		
		
	},1000);
}


let n = 0;

	import {WiktionaryService} from './services/concrete/WiktionaryService.js'
	import {GoogleService} from './services/concrete/GoogleService.js'
	import {ReversoService} from './services/concrete/ReversoService.js'
	import {MultitranService} from './services/concrete/MultitranService.js'
	import {DudenService } from './services/concrete/DudenService.js';
	import {GlosbeService} from './services/concrete/GlosbeService.js';
	import {LingueeService} from './services/concrete/LingueeService.js';
	import {PonsService} from './services/concrete/PonsService.js'
	
	import {ExtendedWord} from './services/entities.js'
	

	const word = ["beobachtet", "Sprachen", "besser", "objektiven", "ausgehen", "Hündinnen"][n]
	const mainForm = ["beobachten", "Sprache", "gut", "objektiv", "ausgehen", "Hündin"][n]

	let extendedWord = new ExtendedWord(word);
	extendedWord.mainForm = mainForm;


	function testWik(){
		console.log("Testing Wiktionary Service")
		let service = new WiktionaryService(word)
		return service.getMeaningWord().then(word => {
			console.log("Parsed word from Wiktionary:", word);
			return word;
		})
	}

	function testGoogle(word){
		console.log("Testing Google Sevice")
		
		let service = new GoogleService(word);
		service.getTranslatedWord().then((data) => {
			console.log("Translated from Google:", data)
		})
	}

	
	function testMultitran(word){
		console.log("Testing Multitran Sevice")
		
		let service = new MultitranService(word);
		service.getTranslatedWord().then((data) => {
			console.log("Translated from Multitran:", data)
		})
	}

	function testPons(word){
		console.log("Testing Pons Sevice")
		
		let service = new PonsService(word);
		service.getTranslatedWord().then((data) => {
			console.log("Translated from Pons:", data)
		})
	}


	function testReverso(){
		console.log("Testing Reverso Context Sevice")
		
		let service = new ReversoService(extendedWord);
		service.getData().then((data) => {
			return data.text()
		}).then((data) => {
			console.log(data);
		})
	}


	function testDuden(){
		console.log("Testing Duden Sevice")
		
		let service = new DudenService(extendedWord);
		service.getData().then((data) => {
			return data.text()
		}).then((data) => {
			console.log(data);
		});
	}


	function testGlosbe(){
		console.log("Testing Glosbe Sevice")
		
		let service = new GlosbeService(extendedWord);
		service.getData().then((data) => {
			return data.text()
		}).then((data) => {
			console.log(data);
		});
	}

	function lingueeTest(){
		console.log("Testing Linguee Sevice")
		
		let service = new LingueeService(extendedWord);
		service.getData().then((data) => {
			return data.text()
		}).then((data) => {
			console.log(data);
		});
	}






	
	let meaningWord = testWik();
	let extended = meaningWord.then((word) => word.extendedWord)
	
	testGoogle(extended);
	testMultitran(extended)
	testPons(extended)
	//testReverso();
	//testDuden();
	//testGlosbe();
	//lingueeTest();


