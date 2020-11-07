class ResourceFetcher {
    static factor = 10000;

    constructor() {
        this.subtitles = null
    }

    getSubtitles(){
        if (this.subtitles != null){
            return Promise.resolve(this.subtitles)
        }
        return this.fetchSubtitles(this.getResource())
            .then(r => r.text())
            .then(this.parse)
            .then(this.toTimeCodes)
            .then((data) => this.finalize(data))
            .catch((e) => {
                console.error("[Navigator] Failed to fetch Netflix Subtitles Resource: "+e)
                return []
            });
    }

    getResource() {
        return window.performance.getEntries()
            .filter(e => e.name.includes("oca.nflxvideo.net/?o"))
            .filter(e => e.entryType === "resource")[0] // TODO loads two times
    }


    fetchSubtitles(resource) {
        console.log("[Navigator] Network Resource:", resource)
        let url = resource.name
        // console.log("[Navigator] GET", url)
        return fetch(url);
    }

    parse(r) {
        let parser = new DOMParser();
        return parser.parseFromString(r, "text/xml")
    }

    toTimeCodes(xml) {
        console.log(xml)
        return Array.prototype.slice.call(xml.querySelector("div").children)
            .map(item => ResourceFetcher.toTimeStamp(item))
    }
    static toTimeStamp(item){
        let begin = item.attributes["begin"].value.slice(0, -1);
        let end = item.attributes["end"].value.slice(0, -1);
        return {
            begin: parseInt(begin)  / this.factor,
            end: parseInt(end)    / this.factor
        }
    }

    finalize(subtitles){
        this.subtitles = subtitles
        console.log(subtitles)
        return subtitles
    }

}


export {ResourceFetcher}