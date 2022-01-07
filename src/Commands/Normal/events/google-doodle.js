const { join } = require('path');
const request = require('node-superfetch');
const moment = require('moment');
require('moment-duration-format');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/month'));

module.exports = {
    name: 'google-doodle',
    aliases: [],
    description: 'Responds with a Google Doodle, either the latest one or a random one from the past.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '[month] [year]',
    run: async (client, message, [ month = 'latest', year ], Discord) => {
        const now = new Date();
        if (month) {
            if (!validate(month)) return message.reply('Please provide a valid month.');
            if (month === 'latest') month = now.getMonth() + 1;
            else month = parse(month);
        }
        if (!year) year = now.getFullYear();
        try {
            const { body } = await request.get(`https://www.google.com/doodles/json/${year}/${month}`);
            if (!body.length) return message.reply('Could not find any results.');
            const data = body[month === 'latest' ? 0 : Math.floor(Math.random() * body.length)];
            const runDate = moment.utc(data.run_date_array.join('-')).format('MMMM Do, YYYY');

            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setTitle(data.share_text)
                .setDescription(runDate)
                .setImage(`https:${data.url}`)
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
