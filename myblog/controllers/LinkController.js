const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const Controller = vertex.Controller
const Link = require('../models/Link')

class LinkController extends Controller {
	constructor(){
		super(Link, process.env)
	}

	get(params) {
		return new Promise((resolve, reject) => {
			Controller.checkCollectionDB(Link.collectionName())
			.then(data => {
				return Link.find(params, Controller.parseFilters(params))
			})
			.then(links => {
				resolve(Link.convertToJson(links))
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	getById(id) {
		return new Promise((resolve, reject) => {
			Controller.checkCollectionDB(Link.collectionName())
			.then(data => {
				return Link.findById(id)
			})
			.then(link => {
				if (link == null){
					throw new Error(Link.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(link.summary())
			})
			.catch(err => {
				reject(new Error(Link.resourceName + ' ' + id + ' not found.'))
			})
		})
	}

	post(body) {
		return new Promise((resolve, reject) => {
			let profile = null
			try {
				profile = JSON.parse(body.profile)
				body['profile'] = profile
			}
			catch(err){
				reject(err)
				return
			}

			let payload = null
			vertex.utils.fetchSite(process.env.TURBO_APP_ID, false)
			.then(site => {
				let isCollaborator = (profile.id == site.profile.id)
				if (isCollaborator == false){
					site.collaborators.every(collaborator => {
						if (collaborator.id != profile.id){
							return true
						}
						else {
							isCollaborator = true
							return false
						}
					})
				}

				if (isCollaborator == false){
					throw new Error('You are not authorized to submit a link.')
					return
				}

				if (body.title != null)
					body['slug'] = vertex.utils.slugVersion(body.title, 6)

				const dateString = vertex.utils.formattedDate() // Tuesday, May 7, 2019
				const dateParts = dateString.split(', ')
				body['dateString'] = (dateParts.length==3) ? dateParts[1]+', '+dateParts[2] : dateString
				return Link.create(body)
			})
			.then(link => {
				payload = link.summary()
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Link.collectionName())
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})

			/*
			if (body.title != null)
				body['slug'] = vertex.utils.slugVersion(body.title, 6)

			const dateString = vertex.utils.formattedDate() // Tuesday, May 7, 2019
			const dateParts = dateString.split(', ')
			body['dateString'] = (dateParts.length==3) ? dateParts[1]+', '+dateParts[2] : dateString

			Link.create(body)
			.then(link => {
				payload = link.summary()
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Link.collectionName())
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			}) */
		})
	}

	put(id, params) {
		return new Promise((resolve, reject) => {
			let payload = null
			Link.findByIdAndUpdate(id, params, {new:true})
			.then(link => {
				payload = link.summary()
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Link.collectionName())
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	delete(id) {
		return new Promise((resolve, reject) => {
			Link.findByIdAndRemove(id)
			.then(() => {
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Link.collectionName())
			})
			.then(data => {
				resolve()
			})
			.catch(err => {
				reject(err)
			})
		})
	}
}

module.exports = LinkController

