const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, next) {

  fastify.addHook('onRequest', async function (request) {
    request.log.info({ request }, 'incoming request')
  })

  fastify.addHook('onResponse', async function (request, response) {
    request.log.info({ request, response }, 'request completed')
  })

  fastify.setErrorHandler((err, req, reply) => {
    if (reply.statusCode >= 500) {
      req.log.error({ req, res: reply, err: err },
        err?.message)
      reply.send(`Fatal error. Contact the support team. Id ${req.id}`)
      return
    }
    req.log.info({ req, res: reply, err: err },
      err?.message)
    reply.send(err)
  })

  next()
})