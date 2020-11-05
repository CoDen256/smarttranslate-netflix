const onMessageSend = (req, _1, _2) => !(req.buttonClick && !window.location.href.match(/.+:\/\/.+netflix\.com\/watch\//));

function run() {
    var scriptsToPrepend = [];

    var mainScript = document.createElement('script');
    mainScript.src = chrome.extension.getURL('./src/main.js');
    mainScript.setAttribute("type", "module");
    scriptsToPrepend.push(mainScript);


    var mainDiv = document.createElement("div");
    mainDiv.id = "main";

    document.querySelector(".sizing-wrapper").prepend(mainDiv);

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


function waitFor(conditionFunction) {
    const poll = resolve => {
        if(conditionFunction()) resolve();
        else setTimeout(_ => poll(resolve), 400);
    }
    return new Promise(poll);
}

function getPopup(){
    return waitFor(_ => !(document.querySelector("#nest-popup") == null))
        .then(_ => (document.querySelector("#nest-popup")))
}


chrome.storage.sync.get(['id'], function(result) {
    getPopup().then(p => p.setAttribute("imdb-id", result.id))
});

chrome.storage.sync.get(['language'], function(result) {
    getPopup().then(p => p.setAttribute("language", result.language))
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        if (key === "id"){
            getPopup().then(p => p.setAttribute("imdb-id", storageChange.newValue))
        }
        if (key === "language"){
            getPopup().then(p => p.setAttribute("language", storageChange.newValue))
        }
    }
});




