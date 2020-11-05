import {ExtendedWord, SimplePartOfSpeech, Substantiv, Verb} from '../../services/entities.js'


// APPO zufolge

class PoSConverter {
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


        if (PoSConverter.isVerb(type)) {
            let prefix = PoSConverter.extractArgument(args, "prefix")
            let reflex = PoSConverter.extractArgument(args, "reflex")

            extended.pos = new Verb(type, prefix, reflex);
            return extended;
        }

        if (PoSConverter.isSub(type)) {
            extended.pos = new Substantiv(type)
            return extended
        }

        if (PoSConverter.isAdj(type) || PoSConverter.isAdv(type)) {
            extended.pos = new SimplePartOfSpeech(type)
            return extended
        }

        return PoSConverter.createDefault(defaultWord);
    }

    static createDefault(defaultWord) {
        let defaultPoS = new ExtendedWord(defaultWord)
        defaultPoS.pos = new SimplePartOfSpeech(null);
        return defaultPoS
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

    static isVerb(type) {
        return type.startsWith("V")
    }

    static isAdj(type) {
        return type.startsWith("ADJ")
    }

    static isAdv(type) {
        return type.startsWith("ADV")
    }

    static isSub(type) {
        return type.startsWith("N")
    }
}

export {PoSConverter}