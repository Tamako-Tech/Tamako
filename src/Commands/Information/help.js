const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const { join } = require('path')
module.exports = {
  config: {
    name: 'help',
    description: 'Replies with help menu.'
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix) => {
    const categories = []

    fs.readdirSync(join(__dirname, '..', 'commands')).forEach((cat) => {
      const commands = fs.readdirSync(join(__dirname, '..', 'commands', cat))
        .filter((file) => file.endsWith('.js'))

      const cmds = commands.map((cmd) => {
        const file = require(join(__dirname, '..', 'commands', cat, cmd))

        if (!file.config.name) return 'ERROR'

        const command = file.config.name.replace('.js', '')

        return `\`${command}\``
      })

      let data = {}
      data = {
        name: cat + ' commands:',
        value: cmds.lenght === 0 ? 'In progress...' : cmds.join(', ') + '.'
      }
      categories.push(data)
    })

    return message.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setAuthor(
              {
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL(
                  {
                    dynamic: true
                  }
                )
              }
            )
            .addFields(categories)
            .setFooter(
              {
                text: `→ Use ${prefix}info for a command info.`
              }
            )
            .setColor('Blue')
            .setFooter({ text: `©️ ${new Date().getFullYear()} Tamako Tech`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        ]
      }
    )
  }
}
