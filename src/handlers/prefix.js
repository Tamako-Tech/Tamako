const fs = require('fs')
const { join } = require('path')
const logger = require(join(__dirname, 'logger'))

const NAMESPACE = 'HANDLER MESSAGE COMMANDS'

module.exports = (client) => {
  fs.readdirSync(join(__dirname, '..', 'commands')).forEach(dir => {
    const commands = fs.readdirSync(join(__dirname, '..', 'commands', dir)).filter(file => file.endsWith('.js'))
    for (const file of commands) {
      const pull = require(join(__dirname, '..', 'commands', dir, file))
      if (pull.config.name) {
        client.commands.set(pull.config.name, pull)
        logger.info(NAMESPACE, `Loaded command: ${pull.config.name}, (#${client.commands.size})`)
      } else {
        logger.error(NAMESPACE, `Command ${file} has no name!`)
        continue
      }
    }
  })
}
