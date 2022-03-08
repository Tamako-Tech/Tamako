const { join } = require('path');
const moment = require('moment');
require('moment-duration-format');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'month.js'));


module.exports = {
    name: 'days-until',
    aliases: [],
    description: 'Responds with how many days there are until a certain date.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '[month] [day] [year]',
    run: async(client, message, [ month, day, year ], container) => {
        if (!validate(month)) return message.reply('Please provide a valid month.');
        if (!month || !day || !year) return message.reply('Incorrect Usage.\nUsage: `t!days-since [month] [day] [year]`');
        if (day > 31 || day < 1) return message.reply('Please provide a valid day.');
        if (year < 1 ) return message.reply('Please provide a valid year.');
        month = parse(month);
        try {
            const now = new Date();
            if(year < new Date().getFullYear()) return message.reply('Please provide a year that is after the current year.');
            if (!year) {
                year = now.getMonth() + 1 <= month ? now.getFullYear() : now.getFullYear() + 1;
                if (month === now.getMonth() + 1 && now.getDate() >= day) ++year;
            }
            const future = new Date(year, month - 1, day);
            const futureFormat = moment.utc(future).format('dddd, MMMM Do, YYYY');
            const time = moment.duration(future - now);
            if (time < 0) return message.reply('This date has already passed!');
            const link = time.months() ? time.months() === 1 ? 'is' : 'are' : time.days() === 1 ? 'is' : 'are';
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`There ${link} ${time.format('Y [years], M [months and] d [days]')} until ${futureFormat}!`)
                .setFooter({ text: `Event Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });
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
