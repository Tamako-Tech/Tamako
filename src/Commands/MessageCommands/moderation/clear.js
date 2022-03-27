module.exports = {
    name: 'clear',
    aliases: [],
    description: 'Clear messages from the channel.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
    category: 'Moderation',
    usage: '<amount of messages>',
    run: async (client, message, [ quantity ], container) => {
        quantity = Math.round(quantity);

        if (!quantity || quantity < 2 || quantity > 100){
            return message.reply(`<:cancel:788323084770738216> | ${message.author}, Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)`);
        }
    
        try {
            // to do
            message.channel.send('In works');
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