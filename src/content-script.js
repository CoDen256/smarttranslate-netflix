const onMessageSend = (req, _1, _2)=> !(req.buttonClick && !window.location.href.match(/.+:\/\/.+netflix\.com\/watch\//));

function run() {
	var scriptsToPrepend = [];
  
	var mainScript = document.createElement('script');
	mainScript.src = chrome.extension.getURL('./src/main.js');
	mainScript.setAttribute("type", "module");
	scriptsToPrepend.push(mainScript);


	
	var mainDiv = document.createElement("div");
	mainDiv.id = "main";

	document.body.append(mainDiv);

	fetch(chrome.extension.getURL("./src/translationPopup.html"))
		.then((data) => data.text())
		.then(data => mainDiv.innerHTML = data)

	let link = document.createElement("link")
	link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
	link.rel = "stylesheet"
	document.head.append(link)

	document.documentElement.prepend.apply(document.documentElement, scriptsToPrepend);

	// Main chrome handler
	chrome.runtime.onMessage.addListener(onMessageSend);
	console.log("Scripts initialized.")
  }

run()
