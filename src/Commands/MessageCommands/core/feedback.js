module.exports = {
    name: 'feedback',
    aliases: [],
    description: 'Send feedback for the bot',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Core',
    usage: '',
    run: async (client, message, [ ...issue ], container) => {   
        if (!issue) return message.reply('Please provide a feedback for the bot.');
        try {  
            const user = message.author;
            
            
            client.cluster.broadcastEval(`
            (async () => {
                const Discord = require('discord.js');
                let channel = await this.users.cache.get('397338324328775680'); 
                if(channel){
                     //if shard has this server, then continue.
                    let message = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Feedback')
                    .addField("Feedback:", '${issue.join(' ')}')
                    .addField("User:", '${user.tag} || ${user.id}') 
                                          
                    channel.send({embeds: [message]})
                }
          })()
        `);
 
            return message.reply('Your feedback has been sent to the developers.');
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
