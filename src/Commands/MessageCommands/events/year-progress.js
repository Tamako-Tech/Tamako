const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'month.js'));
const { embedURL } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'year-progress',
    aliases: ['year', 'year-prog', 'y-progress', 'y-prog'],
    description: 'Responds with the progress of the current year.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '',
    run: async (client, message, [], container) => {
        try {
            const today = new Date();
		    const start = new Date(today.getFullYear(), 0, 1);
		    const end = new Date(today.getFullYear() + 1, 0, 1);
		    const percent = (Math.abs(today - start) / Math.abs(end - start)) * 100;
            const embed = new container.Discord.MessageEmbed()
			    .setColor(0x9797FF)
			    .setDescription(`The year ${today.getFullYear()} is **${percent}%** complete!`)
                .setFooter({ text: `Event Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });
        } catch(err) {
            if (err.status === 404 || err.status === 500) return message.reply('Invalid date.');
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
