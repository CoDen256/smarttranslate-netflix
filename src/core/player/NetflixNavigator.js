class NetflixNavigator {
    constructor() {
        this.time = 0;
        this.subtitles = []
    }

    getResource() {
        return window.performance.getEntries()
            .filter(e => e.name.includes("oca.nflxvideo.net/?o"))
            .filter(e => e.entryType === "resource")[0] // TODO loads two times
    }

    fetchSubtitles(resource) {
        console.log("[Navigator] Network Resource:", resource)
        let url = resource.name
        console.log("[Navigator] GET", url)
        return fetch(url);
    }


    parse(r) {
        let parser = new DOMParser();
        return parser.parseFromString(r, "text/xml")
    }

    toTimeCodes(xml) {
        return Array.prototype.slice.call(xml.querySelector("div").children)
            .map(c => (parseInt(c.attributes["begin"].value.slice(0, -1)) +
                parseInt(c.attributes["end"].value.slice(0, -1))) / 20000)
    }

    async initialize() {
        if (this.subtitles.length === 0) {
            this.subtitles = await this.fetchSubtitles(this.getResource())
                .then(r => r.text())
                .then(this.parse)
                .then(this.toTimeCodes)
        }
    }

    update(time) {
        if (this.subtitles == null) return
        this.time = time
    }

    next() {
        if (this.subtitles.length === 0) {
            console.warn("[Navigator] Unable to navigate to next subtitle, subtitles are not loaded")
            return null;
        }
        this.subtitles.sort((a, b) => a - b)
        for (let subtitle of this.subtitles) {
            if (subtitle > this.time) {
                return subtitle
            }
        }
        return this.subtitles[this.subtitles.length - 1]
    }

    previous() {
        if (this.subtitles.length === 0) {
            console.warn("[Navigator] Unable to navigate to next subtitle, subtitles are not loaded")
            return null;
        }
        this.subtitles.sort((a, b) => b - a)
        let last = null
        for (let subtitle of this.subtitles) {
            if (subtitle < this.time) {
                if (last != null) {
                    return subtitle
                }
                last = subtitle
            }
        }
        return this.subtitles[0]
    }
}

export {NetflixNavigator}