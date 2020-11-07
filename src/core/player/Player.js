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
        console.log("Seeking to ", time)
        this.getPLayer().seek(time);
    }

    play() {
        this.getPLayer().play()
    }

    pause() {
        this.getPLayer().pause()
    }

    getCurrentTime() {
        return this.getPLayer().getCurrentTime()
    }


    getPLayer(){
        if (this.player == null){
            this.player = this.initializePlayer()
        }
        return this.player
    }


}

export {NetflixPlayer}