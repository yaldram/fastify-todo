const fp = require("fastify-plugin")
const fastifyEnv = require("@fastify/env")

module.exports = fp(function (fastify, opts, next) {
  fastify.register(fastifyEnv, {
    // adds secrets property to the fastify instance
    confKey: 'secrets',
    schema: fastify.getSchema('schema:dotenv')
  })

  next()
}, {
  name: "application-config"
})