module.exports = {
    name: 'friday-the-13th',
    aliases: ['friday-13th', 'friday-13', 'friday-the-13', 'friday-the-thirteenth', 'friday-thirteenth'],
    description: 'Determines if today is Friday the 13th.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES'],
    category: 'Events',
    usage: '',
    run: async (client, message, args, container) => {
        try {
            const today = new Date();
		    const isFridaythe13th = today.getDay() === 5 && today.getDate() === 13;
            return message.reply(`Today **is${isFridaythe13th ? '' : ' not'}** Friday the 13th.`);
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
