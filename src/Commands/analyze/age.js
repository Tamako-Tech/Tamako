const { EmbedBuilder } = require('discord.js')

module.exports = {
  config: {
    name: 'age',
    description: 'Responds with how old someone born in a certain year is.',
    alias: [],
    usage: 'play [song name]'
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, [year]) => {
    if (!year) return message.reply('Please provide a year.')
    if (year < 1) return message.reply('Please enter a valid year.')
    try {
      if (!year) return message.reply('Please provide a year.')
      const currentYear = new Date().getFullYear()
      const age = currentYear - year
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription(`Someone born in ${year} will be born in ${Math.abs(age)} years.`)
        .setFooter({ text: `Analyze Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      if (age < 0) return message.reply({ embeds: [embed] })
      return message.reply({ embeds: [embed.setDescription(`You are ${Math.abs(age)} years old.`)] })
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
