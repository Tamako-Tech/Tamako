const { EmbedBuilder } = require('discord.js')

module.exports = {
  config: {
    name: 'ping',
    description: 'Replies with pong!'
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Green')
          .setDescription(`🏓 **Pong!** Client websocket ping: \`${client.ws.ping}\` ms.`)
          .setFooter({ text: `©️ ${new Date().getFullYear()} Tamako Tech`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      ]
    })
  }
}
