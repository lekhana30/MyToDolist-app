const superagent = require('superagent')

module.exports = (appSlug, tpl) => {
    return new Promise((resolve, reject) => {
        const templateName = tpl || 'template'
        const url = 'https://cdn.turbo360-dev.com/templates/base-template-tnzakf/dist/apps/'+appSlug+'/'+templateName+'.html'

        superagent.get(url)
        .query(null)
        .set('Accept', 'text/html')
        .end((err, resp) => {
            if (err){
                reject(err)
                return
            }

            resolve(resp.text)
        })
    })
}