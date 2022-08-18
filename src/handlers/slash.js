require('dotenv').config()
const { join } = require('path')
const { PermissionsBitField, Routes, REST } = require('discord.js')
const fs = require('fs')
const config = require(join(__dirname, '..', 'config', 'config.json'))
const logger = require(join(__dirname, 'logger'))

const NAMESPACE = 'HANDLER SLASH COMMANDS'

module.exports = (client) => {
  const cmds = []

  fs.readdirSync(join(__dirname, '..', 'slashCommands')).forEach(dir => {
    const commands = fs.readdirSync(join(__dirname, '..', 'slashCommands', dir)).filter(file => file.endsWith('.js'))
    for (const file of commands) {
      const pull = require(join(__dirname, '..', 'slashCommands', dir, file))

      if (pull.name) {
        client.slashcmds.set(pull.name, pull)
        logger.info(NAMESPACE, `Loaded command: ${pull.name}, (#${client.slashcmds.size})`)
        cmds.push({
          name: pull.name,
          description: pull.description,
          type: pull.type,
          options: pull.options ? pull.options : null,
          default_permission: pull.default_permission ? pull.default_permission : null,
          default_member_permissions: pull.default_member_permissions ? PermissionsBitField.resolve(pull.default_member_permissions).toString() : null
        })
      } else {
        logger.error(NAMESPACE, `Command ${file} has no name!`)
        continue
      }
    }
  })

  if (!config.Client.ID) {
    logger.error(NAMESPACE, 'No client ID found in config.json')
    return process.exit()
  };

  const rest = new REST({ version: '10' }).setToken(config.Client.TOKEN || process.env.TOKEN);

  (async () => {
    try {
      if (config.Handlers.GUILD_ID) {
        await rest.put(
          Routes.applicationGuildCommands(config.Client.ID, config.Handlers.GUILD_ID),
          { body: cmds }
        )

        const GUILD = await client.guilds.resolve(config.Handlers.GUILD_ID)
        logger.warn(NAMESPACE, `Updated commands for ${GUILD || 'Guild not found'}`)
      } else {
        await rest.put(
          Routes.applicationCommands(config.Client.ID),
          { body: cmds }
        )
        logger.info(NAMESPACE, 'Updated commands for all guilds')
      }
    } catch (err) {
      logger.error(NAMESPACE, err)
    }
  })()
}
