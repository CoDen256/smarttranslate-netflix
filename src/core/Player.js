class NetflixPlayer {

    constructor() {
        this.player = this.initializePlayer();
    }

    initializePlayer(){
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

    isInitialized(){
        return this.player != null;
    }

    seek(time){
        if (time == null) return ;
        console.log("Seeking to ", time)
        this.player.seek(time);
    }

    play(){
        this.player.play()
    }

    pause(){
        this.player.pause()
    }

    getCurrentTime(){
        return this.player.getCurrentTime()
    }
    

}

export {NetflixPlayer}