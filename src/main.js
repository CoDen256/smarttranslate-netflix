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

main()
/* 
import {test} from './test.js';
test("STÖHNT")*/
