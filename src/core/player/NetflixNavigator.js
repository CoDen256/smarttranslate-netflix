import {ResourceFetcher} from "./ResourceFetcher.js";

class NetflixNavigator {
    static tippingPointPercentage = 0.6
    constructor(player) {
        this.player = player
        this.fetcher = new ResourceFetcher();

    }

    seekNext(){
        // console.warn("NEXT "+this.player.getCurrentTime())
        this.fetcher.getSubtitles().then(
            subs => this.seekToNextInSubtitles(subs)
        )
    }

    seekPrev(){
        // console.warn("PREV "+this.player.getCurrentTime())
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
        let currentTime = this.player.getCurrentTime();
        subtitles.sort((a, b) => a.begin - b.begin)
        for (let subtitle of subtitles) {
            if (currentTime < subtitle.begin) {
                return subtitle.begin
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
        let currentTime = this.player.getCurrentTime();
        subtitles.sort((a, b) => b.begin - a.begin)
        for (let [index, subtitle] of subtitles.entries()) {
            if (subtitle.begin < currentTime){
                // found first subtitle that is earlier than current time
                let duration = subtitle.end - subtitle.begin
                let tippingPoint = subtitle.begin + duration * NetflixNavigator.tippingPointPercentage
                if (currentTime > tippingPoint){
                    return subtitle.begin
                }else{
                    if (index+1 >= subtitles.length) return null
                    return subtitles[index+1].begin
                }
            }
        }
        return null
    }

    copy(array){
        return [...array]
    }
}

export {NetflixNavigator}