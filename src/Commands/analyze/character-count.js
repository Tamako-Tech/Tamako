const { EmbedBuilder } = require('discord.js')

module.exports = {
  config: {
    name: 'character-count',
    description: 'Responds with the character count of text.',
    alias: ['characters', 'chars', 'length', 'char-count'],
    usage: 'play [song name]'
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, [...text]) => {
    if (!text) return message.reply('Please provide text.')
    text = text.join(' ')
    try {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription(`${text} has ${text.length} characters.`)
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
