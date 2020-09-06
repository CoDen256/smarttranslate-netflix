import {convertToSeconds, similarity, joinLemma} from './Utils.js'

class TimedSubtitleProvider{
    constructor(script) {
        this.script = script;
        this.current_time = 0
        this.total_time = 0;

        this.last_index = null;
    }

    findByTime(time) {
        for (let i = 0; i < this.script.length; i++) {
            let prev = this.getSubtitleByIndex(i-1);
            let next = this.getSubtitleByIndex(i+1);
            if (convertToSeconds(time) >= convertToSeconds(prev.end)
                && convertToSeconds(time) <= convertToSeconds(next.start)){
                return i
            }
        }
        return 0;
    }


    getSubtitleByTime(time) {
        //if (this.last_index === this.findByTime(time)) return null;
        this.last_index = this.findByTime(time)
        return this.getSubtitleByIndex(this.last_index)
    }

    getSubtitleByIndex(index) {
        return this.script[Math.min(Math.max(0, index), this.script.length-1)]
    }

    getSubtitleByLine(line) {
        let max_similarity = 0;
        let possible_line = null;

        this.script.forEach( lemma => {
            let joined = joinLemma(lemma)
            let similarity = similarity(joined, line);

            if (similarity >= max_similarity){
                max_similarity = similarity
                possible_line = lemma
                if (similarity === max_similarity){
                    // TODO compare time codes
                }
            }
        })
        return {possible_line, max_similarity};
    }



}

export {TimedSubtitleProvider}