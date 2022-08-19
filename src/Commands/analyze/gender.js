const { EmbedBuilder } = require('discord.js')
const request = require('node-superfetch')

module.exports = {
  config: {
    name: 'gender',
    description: 'Determines the race, gender, and age of a face.',
    alias: ['guess-gender', 'gender-guess'],
    usage: '[name]'
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, [name]) => {
    if (!name) return message.reply('Please provide a name.')
    name = name.join(' ')
    if (!name.length > 20) return message.reply('Please provide a name with less than 20 characters.')
    try {
      const { body } = await request
        .get('https://api.genderize.io/')
        .query({ name })

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription(`I have no idea what gender ${body.name} is.`)
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
