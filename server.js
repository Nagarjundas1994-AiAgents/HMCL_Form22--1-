// Local testing only (npm run watch:local): the UI calls /srv-api/... as it does behind the approuter,
// which strips that prefix in the cloud. Does nothing in any other profile.
const cds = require('@sap/cds')

cds.on('bootstrap', app => {
    // checked here, not at load time: cds reads --profile after loading this file
    if (!cds.env.profiles.includes('local')) return
    app.use((req, _res, next) => {
        req.url = req.url.replace(/^\/srv-api\//, '/')
        next()
    })
})

module.exports = cds.server
