class NetflixSubtitleRecorder{
    constructor() {
        this.subtitles = []
        this.current = -1;
    }


    record(time, subtitle){
        let recordedSubtitle = this.subtitles.find(sub => sub.sentence === subtitle)
        if (!(recordedSubtitle !== undefined)){
            this.subtitles.push(new Subtitle(time, subtitle))
            this.next();
        }
    }

    next(){
        if (this.current >= this.subtitles.length-1){return ;}
        return this.subtitles[++this.current]
    }

    previous(){
        if(this.current < 0){return ;}
        return this.subtitles[--this.current]
    }
}

class Subtitle{
    constructor(start, end, sentence) {
        this.start = start
        this.end = end;
        this.sentence = sentence
    }

}

export {NetflixSubtitleRecorder}