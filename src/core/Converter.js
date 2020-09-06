import {ExtendedWord, PoS, Verb, Substantiv} from '../services/entities.js'


// APPO zufolge

class PoSConverter{
    static convert(lemma, defaultWord) {
        if (lemma === undefined || lemma === null) {
            return PoSConverter.createDefault(defaultWord)
        }

        let original = lemma["original"]
        let main = lemma["main"]
        let type = lemma["wordType"]
        let args = lemma["args"]

        let extended = new ExtendedWord(original)
        extended.mainForm = main
        extended.extendedType = type


        if (PoSConverter.isVerb(type)){
            let verb = new Verb(extended)
            verb.prefix = PoSConverter.extractArgument(args, "prefix")
            verb.reflex = PoSConverter.extractArgument(args, "reflex")

            return verb;
        }

        if (PoSConverter.isSub(type)) {
            return new Substantiv(extended)
        }

        if (PoSConverter.isAdj(type) || PoSConverter.isAdv(type)) {
            return new PoS(extended)
        }

        return PoSConverter.createDefault(defaultWord);
    }

    static createDefault(defaultWord) {
        return new PoS(new ExtendedWord(defaultWord))
    }

    static extractArgument(args, argument) {
        if (args !== undefined && args !== null) {
            if (args[argument] !== undefined && args[argument] !== null) {
                if (args[argument] !== "") {
                    return args[argument]
                }
            }
        }
        return null;
    }

    static isVerb(type){return type.startsWith("V")}
    static isAdj(type){return type.startsWith("ADJ")}
    static isAdv(type){return type.startsWith("ADV")}
    static isSub(type){return type.startsWith("N")}
}

export {PoSConverter}