// https://github.com/scottwrobinson/camo
const Document = require('vertex-camo').Document
const props = {
	image: {type:String, default:''},
	title: {type:String, default:'', display:true},
	preview: {type:String, default:'', trim:true},
	reaction: {type:String, default:'', isHtml:true},
	dateString: {type:String, default:''},
	profile: {type:Object, default:{}, immutable:true},
	url: {type:String, default:'', immutable:true},
	domain: {type:String, default:'', immutable:true},
	slug: {type:String, default:'', immutable:true},
	site: {type:String, default:'', immutable:true},
	schema: {type:String, default:'link', immutable:true},
	timestamp: {type:Date, default: new Date(), immutable:true}
}

class Link extends Document {
	constructor(){
		super()
		this.schema(props)

		// this is how to set default values on new instances
		this.timestamp = new Date()
	}

	static get resourceName(){
		return 'link'
	}

	static collectionName(){
		return 'links'
	}
}

module.exports = Link

