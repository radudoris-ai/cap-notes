const cds = require('@sap/cds')
const v2 = require('@cap-js-community/odata-v2-adapter')

cds.on('bootstrap', app => {
    app.use('/v2', v2())  // <-- mount V2 at /v2
})

module.exports = cds.server