const { EmbedBuilder } = require('discord.js')

module.exports = {
  config: {
    name: 'stats',
    description: 'Responds with the stats of the bot.',
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    try {
        const promises = [
            client.cluster.broadcastEval('this.guilds.cache.size'),
            client.cluster.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
            message.guild.shardId,
        ];
        
        return Promise.all(promises)
            .then(results => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
                const shardId = results[2];
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Stats')
                    .setDescription(`**${client.guilds.cache.size}** Guilds on Shard **${shardId}** on Cluster ${client.cluster.id}\n**${client.cluster.info.TOTAL_SHARDS} Total Shards**\n**${totalGuilds}** Total Guilds\n**${totalMembers}** Total Members`);
                return message.reply({ embeds: [embed] });
            }).catch(console.error);
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
