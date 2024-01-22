const fp = require('fastify-plugin')
const { MongoClient, ObjectId } = require("mongodb")

const DB_NAME = "fastify"

module.exports = fp(async function (fastify, opts) {

  if (fastify.mongo) {
    throw Error('fastify-mongodb has already registered')
  }

  // create the mongoclient
  const client = new MongoClient(fastify.secrets.MONGO_URI)

  // connect to mongo db
  await client.connect();
  fastify.log.info("connnected to mongodb successfully")

  // ping the database
  await client.db(DB_NAME).command({ ping: 1 });
  fastify.log.info(`pinged ${DB_NAME} database successfully`);

  // add onClose hook, for closing the database connection
  fastify.addHook('onClose', function closeMongoDb() {
    fastify.log.info("mongodb disconnected")
    return client.close();
  })

  if (!fastify.mongo) {
    fastify.decorate('mongo', {
      db: client.db(DB_NAME),
      ObjectId
    })
  }

}, {
  name: '@fastify/mongodb',
  dependencies: ['application-config']
})