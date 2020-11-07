import {ResourceFetcher} from "./ResourceFetcher.js";

class NetflixNavigator {
    constructor(player) {
        this.player = player
        this.fetcher = new ResourceFetcher();

    }

    seekNext(){
        console.warn("NEXT "+this.player.getCurrentTime())
        this.fetcher.getSubtitles().then(
            subs => this.seekToNextInSubtitles(subs)
        )
    }

    seekPrev(){
        console.warn("PREV "+this.player.getCurrentTime())
        this.fetcher.getSubtitles().then(
            subs => this.seekToPreviousInSubtitles(subs)
        )
    }

    seekToNextInSubtitles(subtitles) {
        if (subtitles.length === 0) {
            console.warn("[Navigator NEXT] Subtitles not loaded")
        }else {
            this.player.seek(this.nextInSubtitles(subtitles))
        }
    }

    nextInSubtitles(original){
        let subtitles = this.copy(original)
        subtitles.sort((a, b) => a.begin - b.begin)
        for (let subtitle of subtitles) {
            if (this.player.getCurrentTime() < subtitle.begin) {
                return subtitle
            }
        }
        // noop if no next subtitle
        return null
    }

    seekToPreviousInSubtitles(subtitles) {
        if (subtitles.length === 0) {
            console.warn("[Navigator PREV] Subtitles not loaded")
        }else {
            this.player.seek(this.previousInSubtitles(subtitles))
        }

    }

    previousInSubtitles(original){
        let subtitles = this.copy(original)
        subtitles.sort((a, b) => b.begin - a.begin)
        let last = null
        for (let subtitle of subtitles) {
            if (subtitle < this.player.getCurrentTime()) {
                if (last != null) {
                    return subtitle
                }
                last = subtitle
            }
        }
        return subtitles[0]
    }

    copy(array){
        return [...array]
    }
}

export {NetflixNavigator}