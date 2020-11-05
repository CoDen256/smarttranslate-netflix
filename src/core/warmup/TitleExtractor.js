import {waitFor} from '../util/Utils.js'

class TitleExtractor {
    async extractMovieInfo(){
        await waitFor(_ => !(document.querySelector(".title") == null))

        let video_title = document.querySelector(".title").textContent
        let episode_info = document.querySelector(".player-title-evidence").querySelector(".playable-title").textContent
        let [season, episode] = episode_info.match(/\d+/g);

        return {title: video_title, season:season, episode:episode}
    }

}

export {TitleExtractor}