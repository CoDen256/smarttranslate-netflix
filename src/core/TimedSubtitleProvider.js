
class TimedSubtitleProvider{
    constructor(script) {
        this.script = script;

        this.current_time = 0
        this.total_time = 0;

        this.last_index = 0;
        this.current_ltc = this.getSubtitleByIndex(this.last_index)
    }

    update(time) {
        this.current_time = time.current
        this.total_time = time.total

        let next = this.getSubtitleByIndex(this.last_index+1)
        if (parseInt(this.current_time) > parseInt(next.start)
            && parseInt(this.current_time) < parseInt(next.end)){

            this.last_index += 1;
            this.current_ltc = next;
        }


    }

    getSubtitleByIndex(index) {
        return this.script[index]
    }

    getSubtitle() {
        return this.current_ltc
    }


}

export {TimedSubtitleProvider}