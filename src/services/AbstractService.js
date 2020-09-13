import {Request} from '../core/requests.js'


class AbstractService {
	constructor(apiUrl, params, extendedWord, client, concreteService){
        // TODO cache
        this.concreteService = concreteService;
        this.apiUrl = apiUrl;
        this.params = params;
        this.extendedWord = extendedWord.clone();

        this.client = client

        if (!(typeof client.normalize === 'function')){
            client.normalize = this.identity;
            console.log(`normalize() of ${client} is not specified`)
        }
        if (!(typeof client.parse === 'function')){
            client.parse = this.identity;
            console.log(`parse() of ${client} is not specified`)
        }
        //client.normalize  // normalize(raw) => Any normalized
        //client.parse      // parse(Any normalized) => Array<String> - translations


        if (!(typeof concreteService.toSpecifiedWord === 'function')) throw "toSpecifiedWord() is not specified"
        if (!(typeof concreteService.mapToString === 'function')) throw "mapToString() is not specified"
        if (!(typeof concreteService.onResult === 'function')) throw "onResult() is not specified"

        //service.toSpecifiedWord // toSpecifiedWord(ext) => new Specified(ext)
        //sevice.mapToString //mapToString(specified) => string to search
        //service.onResult   // onResult(specified, result) => Specified


        this.specifiedWord = this.update(this.concreteService.toSpecifiedWord(extendedWord))
                                          .catch((error) => this.defaultValue(error))
	}

	getData(word){
        console.log(`Getting data for '${word}' from ${this.apiUrl}`)
        
        this.params.query = word;
        let api = new Request(this.apiUrl, this.params)

		return api.fetchData()
	}

	update(specified){
        return this.getData(this.concreteService.mapToString(specified))
                    .then((raw) => this.client.normalize(raw))
				    .then((normalized) => this.client.parse(normalized))
				    .then((result) => this.concreteService.onResult(specified, result));
    }
    
    defaultValue(error){
		console.log("Error while creating Specified word beacause:\n", error)
		console.log("Default value will be returned by", this.client)
        return this.extendedWord.then((extWord) => this.concreteService.toSpecifiedWord(extWord))
    }

	getWord(){
		return this.specifiedWord;
    }
    
    identity(input){return input}
}

export {AbstractService};