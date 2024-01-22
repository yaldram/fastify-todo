'use strict'

const path = require('node:path')
const AutoLoad = require('@fastify/autoload')
const crypto = require('node:crypto')

module.exports = async function (fastify, opts) {
  // load all the schemas
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'schemas'),
    indexPattern: /^loader.js$/i
  })

  // load all the plugins first
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    // don't load plugins (files) with .no-load.js name
    ignorePattern: /.*.no-load\.js/,
    indexPattern: /^no$/i,
    options: Object.assign({}, opts)
  })

  // load all the routes
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    // only load the .routes.js files
    indexPattern: /.*routes(\.js|\.cjs)$/i,
    // don't load .js files
    ignorePattern: /.*\.js/,
    autoHooksPattern: /.*hooks(\.js|\.cjs)$/i,
    autoHooks: true,
    cascadeHooks: true,
    options: Object.assign({}, opts)
  })
}

module.exports.options = {
  disableRequestLogging: true,
  requestIdLogLabel: 'requestId', // renmae default reqId to requestId
  requestIdHeader: 'x-request-id', // usable when you are calling another fasitfy service (distributed)
  genReqId(req) { // will run only if x-request-id is not present
    return req.headers['x-amz-request-id'] ||
      crypto.randomUUID()
  },
  logger: {
    level: "info",
    timestamp: () => {
      const dateString = new Date(Date.now()).toISOString()
      return `,"@timestamp":"${dateString}"`
    },
    redact: {
      censor: '***',
      paths: [
        'req.headers.authorization',
        'req.body.password',
        'req.body.email'
      ]
    },
    serializers: {
      request: function (request) {
        const shouldLogBody = request.routeOptions.config.logBody === true

        return {
          method: request.method,
          url: request.url, // todo/12345
          routeUrl: request.routeOptions.url, // todo/:todoId
          version: request.headers?.['accept-version'],
          user: request.user?.id,
          headers: request.headers,
          body: shouldLogBody ? request.body : undefined,
          hostname: request.hostname,
          remoteAddress: request.ip,
          remotePort: request.socket?.remotePort
        }
      },

      response: function (reply) {
        return {
          statusCode: reply.statusCode,
          responseTime: reply.getResponseTime()
        }
      }
    }
  }
}
