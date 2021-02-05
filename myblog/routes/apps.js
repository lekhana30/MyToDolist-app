// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const superagent = require('superagent')

router.get('/template/:name', (req, res) => {
    // https://cdn.turbo360-dev.com/templates/base-template-tnzakf/dist/apps/blog/template.html

    const templateName = req.params.name
    const url = 'https://cdn.turbo360-dev.com/templates/base-template-tnzakf/dist/apps/'+templateName+'/template.html'

    superagent.get(url)
    .query(null)
    .set('Accept', 'text/html')
    .end((err, resp) => {
        if (err){
            res.json({
                confirmation:'fail',
                message: err.message
            })

            return
        }

        res.send(resp.text)
    })
})


module.exports = router