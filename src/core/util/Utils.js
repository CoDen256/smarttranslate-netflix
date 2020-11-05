const replaceWithSpans = (sentence, id, cl) => sentence.replace(/([a-zäüöß']+)/gi, '<span id="' + id + '" class=' + cl + '>$1</span>');
const pixel = (any) => any.toString() + "px";
const toClass = (any) => "." + any;
const toId = (any) => "#" + any;

function waitFor(conditionFunction) {

    const poll = resolve => {
        if(conditionFunction()) resolve();
        else setTimeout(_ => poll(resolve), 400);
    }

    return new Promise(poll);
}

function convertToSeconds(time) {
    let parts = time.split(".")
    let t = parts[0].split(":")

    let h = t[t.length - 3] || 0
    let m = t[t.length - 2] || 0
    let s = t[t.length - 1] || 0
    let millis = parts[1] || 0

    return parseFloat((parseInt(h) * 60 * 60 + parseInt(m) * 60 + parseInt(s)).toString() + "." + millis)
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}

function timeOfSeconds(duration) {
    let millis = duration.toString().split(".")[1] || "000"
    let hrs = ~~(duration / 3600);
    let mins = ~~((duration % 3600) / 60);
    let secs = ~~duration % 60;
    return [pad(hrs, 2), pad(mins, 2), pad(secs, 2)].join(":") + "." + millis
}

function joinLemma(ltc) {
    if (ltc === undefined) return ""
    let result = ""
    ltc.lemmas.forEach(l => {
        result += l.original + " "
    })
    return result
}

function computeSimilarity(s1, s2) {
    var longer = s1.toLowerCase();
    var shorter = s2.toLowerCase();
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function select(query) {
    return document.querySelector(query)
}

function create(element, cl) {
    let el = document.createElement(element)
    el.classList.add(cl);
    return el
}

function displayFailMessage(content) {
    let item = create("h4", "failed-item")
    item.innerHTML = "Unable to retrieve any information ..."
    content.appendChild(item)
}

function emphasize(sentence) {
    return sentence
        .replace("{{", "<span style='color:yellow'><em><strong>")
        .replace("}}", "</strong></em></span>");
}

export {
    replaceWithSpans, pixel, toClass, toId, convertToSeconds, timeOfSeconds, joinLemma, computeSimilarity,
    select, create, waitFor, displayFailMessage, emphasize
}