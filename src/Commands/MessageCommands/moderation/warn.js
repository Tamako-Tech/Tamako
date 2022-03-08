module.exports = {
    name: 'warn',
    aliases: [],
    description: 'Warn a user in the server.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES', 'MANAGE_GUILD'],
    clientPermissions: ['SEND_MESSAGES', 'MANAGE_GUILD'],
    category: 'Moderation',
    usage: '<user> [reason]',
    run: async (client, message, [ user = '', ...reason ], container) => {
      
        try {
            // to do
            message.channel.send('in works');

        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
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