chrome.browserAction.onClicked.addListener(function (tab) {

    if (!urlChanged(tab)) {
        chrome.tabs.update(tab.id, {url: 'https://www.netflix.com'});
    }

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        console.log("Hello from new version");
        chrome.tabs.sendMessage(tabs[0].id, {buttonClick: true}, function (response) {
        });
    });

});

function urlChanged(tab) {
    if (tab.url.match(/.+:\/\/.+netflix\.com\/watch\//)) {
        chrome.browserAction.setIcon({path: 'icon-small.png', tabId: tab.id});
        return true;
    } else {
        chrome.browserAction.setIcon({path: 'icon-small-disabled.png', tabId: tab.id});
        return false;
    }
}

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
    if (tab.url.match(/.+:\/\/.+netflix\.com\/watch\//)) {
        chrome.tabs.sendMessage( tabId, {
            message: 'RUN',
        })
    }
    return urlChanged(tab);
});

chrome.tabs.onActivated.addListener(function (info) {
    chrome.tabs.get(info.tabId, function (tab) {
        return urlChanged(tab);
    });
});




/*chrome.devtools.network.onRequestFinished.addListener(
	function(request) {
		  console.log(request.request.url)
});*/
/* 
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {    
    if (request.contentScriptQuery == "getData") {
		console.log("hello from background")
        var url = request.url;
        fetch(url)
            .then(response => {
				console.log(response)
				sendResponse(response)})
            .catch()
        return true;
	}
});*/