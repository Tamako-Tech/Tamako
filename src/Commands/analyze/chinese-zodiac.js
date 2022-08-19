const { join } = require('path')
const { EmbedBuilder } = require('discord.js')
const signs = require(join(__dirname, '..', '..', 'assets', 'json', 'chinese-zodiac.json'))

module.exports = {
  config: {
    name: 'chinese-zodiac',
    description: 'Responds with the Chinese Zodiac Sign for the given year.',
    alias: ['chinese-zodiac-sign'],
    usage: '[year]'
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, [year]) => {
    if (!year) return message.reply('Please enter a year.')
    if (year < 1) return message.reply('Please provide a valid year.')
    try {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription(`The Chinese Zodiac Sign for ${year} is ${signs[year % signs.length]}`)
        .setFooter({ text: `Analyze Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      return message.reply({ embeds: [embed] })
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
