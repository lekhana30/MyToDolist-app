const cheerio = require('cheerio')
const superagent = require('superagent')

module.exports = {
	scrape: (pkg) => {
		return new Promise((resolve, reject) => {
			const url = pkg.url
			if (url == null){
				reject(new Error('Missing url parameter'))
				return
			}

			const props = pkg.props || ['title', 'description', 'image', 'url'] // default props
			const headers = {
				'Accept': 'text/html'
			}

			superagent
			.get(url)
			.query(null)
			// .set('Accept', 'text/html')
			.set(headers)
			.end((err, response) => {
				if (err){
					reject(err)
					return
				}

				const metaData = {}
				$ = cheerio.load(response.text)
				// console.log(response.text)
				$('meta').each((i, meta) => {
					if (meta.attribs == null) // continue
						return true
					
					const attribs = meta.attribs
					if (attribs.property == null){ // continue
						return true
					} 

					const prop = attribs.property.replace('og:', '')
					// console.log('PROPERTY == '+prop)
					if (props.indexOf(prop) == -1) // continue
						return true

			        metaData[prop] = attribs.content
		    	})

				// parse actual <title> tag
				if (metaData.title == null){
					$('title').each((i, title) => {
						const keys = Object.keys(title) // ["type","name","namespace","attribs","x-attribsNamespace","x-attribsPrefix","children","parent","prev","next"]
						if (title.children == null)
							return true

						if (title.children.length == 0)
							return true

						const child = title.children[0]
						if (child.data == null)
							return true

						metaData['title'] = child.data
					})
				}

		    	console.log('META == '+JSON.stringify(metaData))
				resolve(metaData)
			})
		})
	}

}
