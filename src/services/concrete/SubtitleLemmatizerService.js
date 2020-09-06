import {Request} from '../../core/requests.js'

const sublemApi = "https://sublem.pythonanywhere.com/sublem/?id={ID}&e={EPISODE}&s={SEASON}"

class SublemService {

    constructor(imdb, season, episode) {
        this.season = season
        this.imdb = imdb;
        this.episode = episode
    }

    async getData(){
        console.log(`Sublem is getting data for series : id=${this.imdb} season=${this.season} episode=${this.episode}`)
        let api = new Request(sublemApi
            .replace("{ID}", this.imdb)
            .replace("{EPISODE}", this.episode)
            .replace("{SEASON}", this.season))

        return api.fetchData().then((data) => data.json())
    }
}

export {SublemService, sublemApi}