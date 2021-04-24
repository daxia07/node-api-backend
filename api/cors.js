const { send } = require('micro')
const microCors = require('micro-cors')
const cors = microCors({ allowMethods: ['PUT', 'POST', 'GET'] })

const handler = (req, res) => send(res, 200, 'ok!')

module.exports = cors(handler)