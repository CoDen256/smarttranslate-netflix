const query = "QUERY"
const source = "SOURCE"
const target = "TARGET"
const sourceFull = "SOURCE_FULL"
const targetFull = "TARGET_FULL"


class URL {
    constructor(pattern, params) {
        this.params = params;
        this.result = this.replaceAll(pattern, params)
    }

    static replaceAll(pattern, params) {
        if (params === undefined) return pattern
        this.checkParams(params)
        return pattern.replace(this.regex(query), encodeURI(params.query))
            .replace(this.regex(source), params.source)
            .replace(this.regex(target), params.target)
            .replace(this.regex(sourceFull), params.sourceFull)
            .replace(this.regex(targetFull), params.targetFull)
    }

    static regex(str) {
        return new RegExp(`{${str}}`, "g")
    }

    static checkParams(params) {
        if (!("query" in params)) {
            params.query = ""
        }
        if (!("source" in params)) {
            params.source = ""
        }
        if (!("target" in params)) {
            params.target = ""
        }
        if (!("sourceFull" in params)) {
            params.sourceFull = ""
        }
        if (!("targetFull" in params)) {
            params.targetFull = ""
        }
    }

    static applyQuery(params, query){
        params.query = query
        return params
    }
}

export {URL}