const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const { join } = require('path')
const client = require(join(__dirname, '..', '..', 'index'))
const config = require(join(__dirname, '..', '..', 'config', 'config.json'))
const logger = require(join(__dirname, '..', '..', 'handlers', 'logger'))

const NAMESPACE = 'messageCreate'

module.exports = {
  name: 'messageCreate'
}

client.on('messageCreate', async message => {
  const prefix = config.Prefix || 'T!'

  if (message.channel.type !== 0) return
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return
  if (!message.guild) return
  if (!message.member) message.member = await message.guild.fetchMember(message)

  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const cmd = args.shift().toLowerCase()
  if (cmd.length === 0) return

  const command = client.commands.get(cmd) ?? client.commands.get(client.commands.alias.get(cmd))

  if (!command) return

  if (command) {
    if (command.permissions) {
      if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions || []))) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setDescription('🚫 Unfortunately, you are not authorized to use this command.')
              .setFooter({ text: `©️ ${new Date().getFullYear()} Tamako Tech`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          ]
        })
      }
    };

    if (command.owner, command.owner === true) { // eslint-disable-line no-sequences
      if (!config.Users.OWNERS) return

      const allowedUsers = [] // Allowed users array

      config.Users.OWNERS.forEach(user => {
        const fetchedUser = message.guild.members.cache.get(user)
        if (!fetchedUser) return allowedUsers.push('*Unknown User#0000*')
        allowedUsers.push(`${fetchedUser.user.tag}`)
      })

      if (!config.Users.OWNERS.some(ID => message.member.id.includes(ID))) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setDescription(`🚫 Sorry but only owners can use this command! Allowed users:\n**${allowedUsers.join(', ')}**`)
              .setFooter({ text: `©️ ${new Date().getFullYear()} Tamako Tech`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          ]
        })
      }
    };

    try {
      command.run(client, message, args, prefix, config)
    } catch (error) {
      logger.error(NAMESPACE, 'Error while running command', error)
    };
  }
})
