import {waitFor} from '../Utils.js'

class TitleExtractor {
    async extract(){
        // let video_title = document.body.querySelector(".video-title");
        // let title = video_title.querySelector("h4").textContent
        // let episode_info = video_title.querySelector("span").textContent
        // let [season, episode] = episode_info.match(/\d+/g);

        // await delay(2000)

        await waitFor(_ => !(document.querySelector(".title") == null))

        let video_title = document.querySelector(".title").textContent
        let episode_info = document.querySelector(".player-title-evidence").querySelector(".playable-title").textContent
        let [season, episode] = episode_info.match(/\d+/g);

        return {title: video_title, season:season, episode:episode}
    }

    delay (ms) {
        return new Promise(res => setTimeout(res, ms));
    }


}

export {TitleExtractor}