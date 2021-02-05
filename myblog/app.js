// Full Documentation - https://docs.turbo360.co
const vertex = require('vertex360')({site_id:process.env.TURBO_APP_ID, api_key:process.env.TURBO_API_KEY})
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID, api_key:process.env.TURBO_API_KEY})
const path = require('path')
const controllers = require('./controllers')

const config = {
	views:  'views', 	// Set views directory
	static: 'public', 	// Set static assets directory
	logging: true,
	controllers: controllers,
	db: vertex.nedbConfig((process.env.TURBO_ENV=='dev') ? 'nedb://'+path.join(__dirname, process.env.TMP_DIR) : 'nedb://'+process.env.TMP_DIR)
}

const app = vertex.app(config) // initialize app with config options

// order matters here:
app.use(vertex.fetchGlobal(process.env.TURBO_API_KEY, process.env.TURBO_ENV, turbo)) // fetch global config on every route
app.use(vertex.setContext(process.env)) // set CDN and global object on 'req.context'

// import routes
const page = require('./routes/page')
const apps = require('./routes/apps')
const api = require('./routes/api')

// set routes
app.use('/', page)
app.use('/apps', apps)
app.use('/api', api)


module.exports = app
