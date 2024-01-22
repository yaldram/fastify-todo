const { listen } = require('fastify-cli/helper')
const argv = ['-l', 'info', '--options', 'app.js']
listen(argv)