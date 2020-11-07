class NetflixPlayer {

    constructor() {
        this.player = null;
    }

    initializePlayer() {
        const videoPlayer = netflix
            .appContext
            .state
            .playerApp
            .getAPI()
            .videoPlayer
        const playerSessionId = videoPlayer
            .getAllPlayerSessionIds()[0]

        return videoPlayer
            .getVideoPlayerBySessionId(playerSessionId)
    }

    isInitialized() {
        return this.player != null;
    }

    seek(time) {
        if (time == null) return;
        // console.log("Seeking to ", time)
        this.getNetflixPLayer().seek(time);
    }

    play() {
        this.getNetflixPLayer().play()
    }

    pause() {
        this.getNetflixPLayer().pause()
    }

    getCurrentTime() {
        // console.log("[Player] time:", this.getNetflixPLayer().getCurrentTime())
        return this.getNetflixPLayer().getCurrentTime()
    }


    getNetflixPLayer(){
        if (this.player == null){
            this.player = this.initializePlayer()
        }
        return this.player
    }


}

export {NetflixPlayer}