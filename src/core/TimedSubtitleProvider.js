import {convertToSeconds, computeSimilarity, joinLemma} from './Utils.js'

class TimedSubtitleProvider{
    constructor(script) {
        this.script = script;
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

        const computeSim = (s1, s2) => computeSimilarity(s1, s2)
        const adjust = (s) => this.adjustLine(s)

        this.script.forEach( lemma => {
            if (lemma !== undefined && lemma != null){
                let joined = joinLemma(lemma)
                let similarity = computeSim(joined, adjust(line));

                if (similarity >= max_similarity){
                    max_similarity = similarity
                    possible_line = lemma
                    //console.log(lemma, max_similarity)
                    if (similarity === max_similarity){
                        // TODO compare time codes
                    }
                }
            }
        })
        //console.log("RESULT", possible_line, max_similarity)
        return {ltc: possible_line, probability: max_similarity};
    }

    isLoaded(){
        return this.script != null && this.script.length !== 0;
    }


    adjustLine(s) {
        return s.replaceAll("-", " ")
            .replaceAll(/\d/g, "")
            .replaceAll(/<\\?\w>/g, "")
            .replaceAll(/[\,\.\!\?]/g, "")
            .replaceAll(/\s{2,}/g, " ")
    }
}

export {TimedSubtitleProvider}