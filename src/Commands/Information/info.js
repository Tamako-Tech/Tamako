const { EmbedBuilder, codeBlock } = require('discord.js')

module.exports = {
  config: {
    name: 'info',
    description: "Get a command's information.",
    usage: 'info [command]'
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    if (!args[0]) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription('Please provide a command name.')
            .setFooter({ text: `©️ ${new Date().getFullYear()} Tamako Tech`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        ]
      })
    }

    const command = client.commands.get(args[0].toLowerCase())

    if (!command) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription("Sorry, but that command doesn't exists.")
            .setFooter({ text: `©️ ${new Date().getFullYear()} Tamako Tech`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        ]
      })
    }

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Blue')
          .setTitle(`Command Information: ${command.config.name.toUpperCase()}`)
          .addFields(
            { name: 'Description:', value: command.config.description || 'No Description was provided.' },
            { name: 'Usage:', value: command.config.usage ? codeBlock('txt', command.config.usage) : 'No Usage was provided.' },
            { name: 'Permissions:', value: command.permissions.join(', ') },
            { name: 'Developer only?', value: command.owner ? 'Yes' : 'No' }
          )
          .setFooter({ text: `©️ ${new Date().getFullYear()} Tamako Tech`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      ]
    })
  }
}
