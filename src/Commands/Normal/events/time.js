const { join } = require('path');
const moment = require('moment-timezone');
moment.tz.link('America/Los_Angeles|Discord');
const { firstUpperCase } = require(join(__dirname, '../../../Functions/Utils'));

module.exports = {
    name: 'time',
    aliases: ['time-zone'],
    description: 'Responds with the current time in a particular location.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '[TimeZone]',
    run: async (client, message, [ timeZone ], Discord) => {
        timeZone = timeZone.replaceAll(' ', '_').toLowerCase();
        if (!moment.tz.zone(timeZone)) {
            let embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setAuthor('Baka')
                .setTitle('Invalid time zone')
                .setDescription('Refer to [TimeZone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)')
                .setFooter({ text: `Event Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });
        }
        try {
            const time = moment().tz(timeZone).format('h:mm A');
            const location = timeZone.split('/');
            const main = firstUpperCase(location[0], /[_ ]/);
            const sub = location[1] ? firstUpperCase(location[1], /[_ ]/) : null;
            const subMain = location[2] ? firstUpperCase(location[2], /[_ ]/) : null;
            const parens = sub ? ` (${subMain ? `${sub}, ` : ''}${main})` : '';
            let embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setAuthor(`Time in ${subMain || sub || main}${parens}`)
                .setDescription(`Current Time: ${time}`)
                .setFooter({ text: `Event Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new Discord.MessageEmbed()
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
