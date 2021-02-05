const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const controllers = require('../controllers')
const utils = require('../utils')
const mustache = require('mustache')

const apps = [
	{
		id: 2,
		name: 'Blog',
		slug: 'blog',
		detail: 'Recent Blog Posts',
		icon: 'icon-file-text'
	},
	{
		id: 3,
		name: 'Reading List',
		slug: 'links',
		detail: 'Interesting Links from Other Sites',
		icon: 'icon-link'
	},
	{
		id: 4,
		name: 'About',
		slug: 'about',
		detail: 'About this Site',
		icon: 'icon-info'
	}
]

const objectify = (array) => {
	const obj = {}
	array.forEach(entry => {
		obj[entry.id] = entry
	})

	return obj
}

const isMobile = (req) => {
	let userAgent = req.headers['user-agent'] || req.headers['User-Agent']
	userAgent = userAgent.toLowerCase()

	return (userAgent.includes('iphone') || userAgent.includes('android'))
}

const populateData = (req, index, entry) => {
	const data = req.context
	// console.log('CONTEXT: '+JSON.stringify(data))
	const selectedIndex = req.query.selected || index

	data.preloadData('isMobile', isMobile(req))
	data['sections'] = apps

	const sectionsMap = objectify(data.sections)
	data.preloadData('sections', sectionsMap)
	data.preloadData('selected', selectedIndex)
	data['app'] = sectionsMap[selectedIndex]

	// this should be moved to the context obj:
	if (req.query.vtxtoken)
		data['token'] = req.query.vtxtoken

	data['entry'] = (entry) ? entry : 'standard'
	return data
}

router.get('/', (req, res) => {
	const context = req.context
	const data = populateData(req, context.global.defaultSelection)
	res.render('home', data)
})

router.get('/currentuser', (req, res) => {
	const data = req.context
	res.json({
		currentuser: data.vertexUser || 'not logged in'
	})
})

router.get('/scrape', (req, res) => {
	const url = req.query.url
	vertex.utils.execute('scrape-meta-tags', {url:url})
	.then(data => {
		res.json({
			confirmation: 'success',
			data: data
		})
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

router.get('/:page', (req, res) => {
	const data = req.context
	res.render(req.params.page)	
})

router.get('/post/:slug', (req, res) => {
	const data = populateData(req, 2, 'comments')
	data['url'] = 'https://'+data.site.url+'/post/'+req.params.slug

	const postCtr = new controllers.post()
	postCtr.get({slug:req.params.slug})
	.then(posts => {
		if (posts.length == 0){
			throw new Error('Post not found')
			return
		}

		data['post'] = posts[0]
		data.setEntity(data.post)
		return utils.template('blog', 'entity')
	})
	.then(template => {
		data['mainContent'] = mustache.render(template, data)
		res.render('post', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

router.get('/link/:slug', (req, res) => {
	const data = populateData(req, 3, 'comments')
	data['url'] = 'https://'+data.site.url+'/link/'+req.params.slug

	const linkCtr = new controllers.link()
	linkCtr.get({slug:req.params.slug})
	.then(links => {
		if (links.length == 0){
			throw new Error('Link not found')
			return
		}

		data['link'] = links[0]
		data.setEntity(data.link)
		return utils.template('links', 'entity')
	})
	.then(template => {
		data['mainContent'] = mustache.render(template, data)
		res.render('link', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

module.exports = router
