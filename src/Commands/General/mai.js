const { EmbedBuilder } = require('discord.js')
const { join } = require('path')
const { safe, nsfw } = require(join(__dirname, '..', '..', 'assets', 'json', 'mai.json'))

module.exports = {
  config: {
    name: 'mai',
    description: 'Tamako is the best girl and there\'s no denying it! but you should also check out Mai',
    alias: ['oneechan'],
    usage: ''
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, [...issue]) => {
    if (!issue) return message.reply('Please provide a feedback for the bot.')
    try {
      if (message.channel.nsfw) return message.channel.send({ embeds: [new EmbedBuilder().setImage(nsfw[Math.ceil(Math.random() * (nsfw.length))])] })
      return message.channel.send({ embeds: [new EmbedBuilder().setImage(safe[Math.ceil(Math.random() * (safe.length))])] })
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
