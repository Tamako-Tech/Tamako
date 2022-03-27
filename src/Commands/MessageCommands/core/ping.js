module.exports = {
    name: 'ping',
    description: 'Responds with the Ping.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Core',
    usage: '',
    run: async (client, message, args, container) => {   
        
        try {
            const promises = [
                message.guild.shardId,
            ];
            
            return Promise.all(promises)
                .then(results => {
                    const ping = Math.round(client.ws.ping);                    
                    const embed = new container.Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Pong!')
                        .setDescription(`**${ping}** ms on shard ${results[0]}`)
                        .setFooter({text:`Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })});
                    return message.reply({ embeds: [embed] });
                }).catch(console.error);

            
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${container.Config.prefix[0]}feedback\` command`, embeds: [ 
                new container.Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }
    }   
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
