const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, next) {
  fastify.addSchema(require('./dotenv.json'))
  fastify.addSchema(require('./limit.json'))
  fastify.addSchema(require('./skip.json'))

  next()
})