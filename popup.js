chrome.storage.sync.get(['id'], function(result) {
    document.getElementById("imdb-id").value = result.id
});

chrome.storage.sync.get(['language'], function(result) {
    document.getElementById("language").value = result.language
});

document.getElementById("language").value = chrome.storage.sync.set

document.addEventListener("DOMContentLoaded", function (){
    let button = document.getElementById("apply-btn");
    button.addEventListener("click", function (){
        // alert(`id: ${document.getElementById("imdb-id").value}, lan:${document.getElementById("language").value}`)
        chrome.storage.sync.set({'id': document.getElementById("imdb-id").value}, function() {});
        chrome.storage.sync.set({'language': document.getElementById("language").value}, function() {});
    }, false)

}, false)