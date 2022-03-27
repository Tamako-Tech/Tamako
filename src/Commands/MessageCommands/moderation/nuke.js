module.exports = {
    name: 'nuke',
    aliases: [],
    description: 'Removes all messages in the channel (Deletes the old channel and makes a copy of it with permissions intact)',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
    clientPermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
    category: 'Moderation',
    usage: '',
    run: async (client, message, args, container) => {
        
        try {
            await message.reply('This will remove all conversation in this channel and may cause conflict for bots using ID to track channels. Continue?');

            const msg_filter = (m) => m.author.id === message.author.id;
            const proceed = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: 30000, errors: ['time'] })
                .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
                .catch(() => false);
            
            if (!proceed){
                return message.reply(`\\❌ | **${message.author.tag}**, you cancelled the nuke command!`);
            }
    
            return message.reply(`The nuke has been deployed, saying goodbye to **#${message.channel.name}** in 10`)
                .then(() => setTimeout(() => message.channel.clone()
                    .then(() => message.channel.delete().catch(() => null)), 10000));

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
