const { EmbedBuilder } = require('discord.js')

module.exports = {
  config: {
    name: 'feedback',
    description: 'Send feedback for the bot',
    alias: [],
    usage: ''
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, [...issue]) => {
    if (!issue) return message.reply('Please provide a feedback for the bot.')
    try {
      const user = message.author

      client.cluster.broadcastEval(`
        (async () => {
            const Discord = require('discord.js');
            let channel = await this.users.cache.get('397338324328775680'); 
            if(channel){
                 //if shard has this server, then continue.
                let message = new Discord.EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Feedback')
                .addFields({
                    name: 'User',
                    value: '${user.tag} || ${user.id}',
                },{
                    name: 'Issue',
                    value: '${issue.join(' ')}',
                })     
                channel.send({embeds: [message]})
            }
      })()
    `)

      return message.reply('Your feedback has been sent to the developers.')
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
