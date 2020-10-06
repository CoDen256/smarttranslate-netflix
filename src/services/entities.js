// Tags: https://www.sketchengine.eu/german-stts-part-of-speech-tagset/
// GENDER : "f", "m", "n"
import {DefaultRenderer} from "../core/renderers/header/default.js";
import {VerbRenderer} from "../core/renderers/header/verb.js";
import {SubstantivRenderer} from "../core/renderers/header/substantiv.js";

function check(param) {
    return param !== "undefined" ? param : null;
}

class ExtendedWord {
    constructor(original) {
        this.original = original;
        this.mainForm = original;
        this.pos = null;
    }

    clone() {
        let cloned = new ExtendedWord(this.original);
        cloned.mainForm = this.mainForm
        cloned.pos = this.pos.clone()
        return cloned;
    }

    isDefault() {
        return this.mainForm === this.original
            && this.pos.type == null;
    }

    prepareToTranslation(word) {
        console.assert(word === this.original || word === this.mainForm)
        return this.pos.prepareToTranslation(word)
    }

    prepareToMeaning(word) {
        console.assert(word === this.original || word === this.mainForm)
        return this.pos.prepareToMeaning(word)
    }

    prepareToContext(word) {
        console.assert(word === this.original || word === this.mainForm)
        return this.pos.prepareToContext(word)
    }

    getHeaderRendererClass() {
        return this.pos.getHeaderRendererClass()
    }

}

class Verb {
    constructor(type, prefix, reflex) {
        this.type = type;
        this.prefix = check(prefix)
        this.reflex = check(reflex)
    }

    clone() {
        return new Verb(this.type, this.prefix, this.reflex)
    }

    prepareToTranslation(word) {
        let reflex_part = this.reflex === true ? "sich " : ""
        let prefix_part = this.prefix || ""
        return `${reflex_part}${prefix_part}${word}`
    }

    prepareToMeaning(word) {
        let prefix_part = this.prefix || ""
        return `${prefix_part}${word}`
    }

    prepareToContext(word) {
        return this.prepareToTranslation(word);
    }

    getHeaderRendererClass() {
        return VerbRenderer
    }
}

class Substantiv {
    constructor(type, gender) {
        this.type = type;
        this.gender = check(gender);
    }

    clone() {
        return new Substantiv(this.type, this.gender)
    }

    prepareToTranslation(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    prepareToMeaning(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    prepareToContext(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    getHeaderRendererClass() {
        return SubstantivRenderer
    }
}

class SimplePartOfSpeech {
    constructor(type) {
        this.type = type
    }

    clone() {
        return new SimplePartOfSpeech(this.type)
    }

    prepareToTranslation(word) {
        return word;
    }

    prepareToMeaning(word) {
        return word;
    }

    prepareToContext(word) {
        return word;
    }

    getHeaderRendererClass() {
        return DefaultRenderer
    }
}

class TranslatedWord {
    constructor(extendedWord) { // normilized Word: ExtendedWord
        this.extendedWord = extendedWord // each service fives own translation, maybe even several translations
        this.translations = []; //TODO: Maybe Translation - class
    }

    getTranslations() { // Array<String> of translations
        return this.translations;
    }

    addTranslations(newTranslations = []) {
        if (newTranslations === []) return;
        this.translations = this.translations.concat(newTranslations)
        return this;
    }

    addTranslation(newTranslation = "") {
        if (newTranslation == null || newTranslation === "") return;
        this.translations.push(newTranslation)
        return this;
    }
}

class MeaningWord {// TODO: synonyme
    constructor(extendedWord) {
        this.extendedWord = extendedWord;
        this.meanings = [];
    }

    getMeanings() { // Array<String> of meanings
        return this.meanings;
    }

    addMeanings(newMeanings = []) {
        if (newMeanings === []) return;
        this.meanings = this.meanings.concat(newMeanings)
        return this;
    }

    addMeaning(newMeaning = "") {
        if (newMeaning == null || newMeaning === "") return;
        this.meanings.push(newMeaning)
        return this;
    }
}

class ContextWord {
    constructor(extendedWord) {
        this.extendedWord = extendedWord;
        this.contexts = [];
    }

    getContexts() { // Array<Context> of contexts
        return this.contexts;
    }

    addContext(sentence = "", translation = "") {
        if (sentence == null || sentence === "") return;
        this.contexts.push(new Context(sentence, translation))
        return this;
    }

    addContexts(newContexts) { // Array<Array<String, String>>
        newContexts.forEach(pair => {
            this.addContext(pair[0], pair[1])
        })
        return this;
    }
}

class Context {
    constructor(sentence = "", translation = "") {
        this.sentence = sentence;
        this.translation = translation;
    }
}

export {ExtendedWord, TranslatedWord, MeaningWord, ContextWord, Context, SimplePartOfSpeech, Verb, Substantiv}