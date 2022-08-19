const { join } = require('path')
const { EmbedBuilder } = require('discord.js')
const { validate, parse } = require(join(__dirname, '..', '..', 'utils', 'types', 'month'))
const { firstUpperCase, list } = require(join(__dirname, '..', '..', 'utils', 'utilities'))
const { months } = require(join(__dirname, '..', '..', 'assets', 'json', 'month.json'))
const stones = require(join(__dirname, '..', '..', 'assets', 'json', 'birthstone.json'))

module.exports = {
  config: {
    name: 'birthstone',
    description: 'Responds with the Birthstone for a month.',
    alias: [],
    usage: 'play [song name]'
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, [month]) => {
    if (!month) return message.reply('Please enter a month.')
    if (!validate(month)) return message.reply('Please enter a valid month.')
    month = parse(month)
    try {
      const stone = stones[month - 1]
      const alternate = stone.alternate ? ` Alternatively, you can also use ${list(stone.alternate, 'or')}.` : ''
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription(`The Birthstone for ${firstUpperCase(months[month - 1])} is ${stone.primary}.${alternate}`)
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
