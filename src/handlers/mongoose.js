require('dotenv').config()
const mongoose = require('mongoose')
const { join } = require('path')
const config = require(join(__dirname, '..', 'config', 'config.json'))
const logger = require(join(__dirname, 'logger'))
const NAMESPACE = 'DATABASE - MONGO'

module.exports = () => {
  logger.debug(NAMESPACE, 'Connecting to database...')
  const mongo = process.env.MONGO || config.Handlers.MONGO

  if (!mongo) {
    logger.warn(NAMESPACE, 'No MONGO environment variable found!')
  } else {
    mongoose.connect(mongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).catch((e) => logger.error(NAMESPACE, 'Error Occurred', e))

    mongoose.connection.once('open', () => {
      logger.info(NAMESPACE, 'Connected to database!')
    })
  }
}
