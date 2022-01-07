const { join } = require('path');
const moment = require('moment');
require('moment-duration-format');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/month'));


module.exports = {
    name: 'days-since',
    aliases: [],
    description: 'Responds with how many days there have been since a certain date.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '[month] [day] [year]',
    run: async(client, message, [ month, day, year ], Discord) => {
        if (!validate(month)) return message.reply('Please provide a valid month.');
        if (!month || !day || !year) return message.reply('Incorrect Usage.\nUsage: `t!days-since [month] [day] [year]`');
        if (day > 31 || day < 1) return message.reply('Please provide a valid day.');
        if (year < 1 ) return message.reply('Please provide a valid year.');
        month = parse(month);
        try {
            const now = new Date();
            const past = new Date(year, month - 1, day);
            if (year < 100) past.setFullYear(year);
            const pastFormat = moment.utc(past).format('dddd, MMMM Do, YYYY');
            const time = moment.duration(now - past);
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`There have been ${time.format('Y [years,] M [months and] d [days]')} since ${pastFormat}!`)
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
