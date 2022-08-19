const { EmbedBuilder } = require('discord.js')
const request = require('node-superfetch')

module.exports = {
  config: {
    name: 'safe-url',
    description: 'Determines if a URL is safe or not.',
    alias: ['check-url', 'safe-browsing', 'virus', 'safe-link', 'check-link'],
    usage: '[url]'
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, [url]) => {
    if (!url) return message.reply('Please provide a URL.')

    try {
      const { body } = await request
        .post('https://safebrowsing.googleapis.com/v4/threatMatches:find')
        .query({ key: process.env.GOOGLE_KEY })
        .send({
          client: {
            clientId: 'tamako-container.Discord',
            clientVersion: '1.0.0'
          },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }]
          }
        })
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription('👍 Good to go! This link is safe!')
        .setFooter({ text: `Analyze Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

      if (!body.matches) return message.reply({ embeds: [embed] })

      embed.setColor('RED').setDescription('⚠️ This link is unsafe! **Do not click it!** ⚠️')

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
