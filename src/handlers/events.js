const fs = require('fs')
const { join } = require('path')
const logger = require(join(__dirname, 'logger'))

const NAMESPACE = 'HANDLER EVENT'

module.exports = (client) => {
  fs.readdirSync(join(__dirname, '..', 'events')).forEach(dir => {
    const commands = fs.readdirSync(join(__dirname, '..', 'events', dir)).filter(file => file.endsWith('.js'))
    for (const file of commands) {
      const event = require(join(__dirname, '..', 'events', dir, file))
      if (event.name) {
        client.events.set(event.name, event)
        logger.info(NAMESPACE, `Loaded event: ${event.name}`)
      } else {
        logger.error(NAMESPACE, `Event ${file} has no name!`)
        continue
      }
    }
  })
}
