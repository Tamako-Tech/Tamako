const { join } = require('path')
const client = require(join(__dirname, '..', '..', 'index.js'))
const logger = require(join(__dirname, '..', '..', 'handlers', 'logger'))

module.exports = {
  name: 'ready.js'
}

client.once('ready', async () => {
  logger.info('READY', `${client.user.tag} is ready!`)
})
