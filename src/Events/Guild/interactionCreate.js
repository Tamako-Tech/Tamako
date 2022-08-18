const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const { join } = require('path')
const client = require(join(__dirname, '..', '..', 'index'))
const config = require(join(__dirname, '..', '..', 'config', 'config.json'))
const logger = require(join(__dirname, '..', '..', 'handlers', 'logger'))

const NAMESPACE = 'interactionCreate'

module.exports = {
  name: 'interactionCreate'
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return
  if (!interaction.type === 2) return

  const command = client.slashcmds.get(interaction.commandName)

  if (!command) return

  try {
    if (command.guild_member_permissions) {
      if (!interaction.memberPermissions.has(PermissionsBitField.resolve(command.guild_member_permissions || []))) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setDescription('🚫 Unfortunately, you are not authorized to use this command.')
              .setFooter({ text: `©️ ${new Date().getFullYear()} Tamako Tech`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          ],
          ephemeral: true
        })
      }
    } else if (command.guild_client_permissions) {
      if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.guild_client_permissions || []))) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setDescription('🚫 Unfortunately, I can\'t execute this command.')
              .setFooter({ text: `Required permissions: ${command.guild_client_permissions.join(', ')} | ©️ ${new Date().getFullYear()} Tamako Tech`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          ],
          ephemeral: true
        })
      }
    };

    await command.run(client, interaction, config)
  } catch (error) {
    logger.error(NAMESPACE, 'Error while running command', error)
  }
})
