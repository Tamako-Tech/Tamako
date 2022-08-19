const { EmbedBuilder } = require('discord.js')

module.exports = {
  config: {
    name: 'ping',
    description: 'Replies with pong!'
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    try {
      const promises = [
        message.guild.shardId
      ]

      return Promise.all(promises)
        .then(results => {
          const ping = Math.round(client.ws.ping)
          const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Pong!')
            .setDescription(`**${ping}** ms on shard ${results[0]}`)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          return message.reply({ embeds: [embed] })
        }).catch(console.error)
      } catch (err) {
        return message.reply({
          content: 'Let my developer know in the support server https://discord.gg/dDnmY56 or using `t!feedback` command',
          embeds: [
            new EmbedBuilder()
              .setTitle('Error')
              .setDescription(`\`${err}\``)
              .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
        })
      }
  }
}
