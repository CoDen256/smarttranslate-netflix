const onMessageSend = (req, _1, _2)=> !(req.buttonClick && !window.location.href.match(/.+:\/\/.+netflix\.com\/watch\//));

function run() {
	var scriptsToPrepend = [];
  
	var mainScript = document.createElement('script');
	mainScript.src = chrome.extension.getURL('./src/main.js');
	mainScript.setAttribute("type", "module");
	scriptsToPrepend.push(mainScript);
  
	document.documentElement.prepend.apply(document.documentElement, scriptsToPrepend);

	// Main chrome handler
	chrome.runtime.onMessage.addListener(onMessageSend);
	console.log("Scripts initialized.")
  }

run()
