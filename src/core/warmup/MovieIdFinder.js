import {Request} from '../util/requests.js'
import {Config} from '../util/config.js'
const omdbapi = "http://www.omdbapi.com/?i=tt3896198&apikey=d432debb&s="

class MovieIdFinder {

    constructor(title) {
        this.title = title
    }

    getId() {
        console.log("Movie finder for "+this.title)
        let api = new Request(omdbapi + this.title)

        return api.fetchData().then((data) => data.json())
            .then(data => {
                console.log(data)
                return data
            })
            .then(data => data["Search"])
            .then(array => array.find(el => el["Title"] === this.title))
            .then(title => title["imdbID"])
            .then(id => id.substring(2))
            .catch(() => {
                console.warn("Using default id for the movie")
                return this.getDefaultId()
            })
    }

    getDefaultId(){
        return Config.getCurrentSettings().default_id
    }
}

export {MovieIdFinder, omdbapi}