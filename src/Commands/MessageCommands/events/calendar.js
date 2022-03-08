const { join } = require('path');
const { stripIndents } = require('common-tags');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'month.js'));
const { isLeap, firstUpperCase } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));
const { months } = require(join(__dirname, '..', '..', '..', 'assets', 'json', 'month.json'));
const monthsWith30 = [4, 6, 9, 11];


module.exports = {
    name: 'calendar',
    aliases: ['cal'],
    description: 'Responds with the calendar for a specific month and year.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '[month] [year]',
    run: async(client, message, [ month, year ], container) => {
        if (!validate(month)) return message.reply('Please provide a valid month');
        if (year < 1) return message.reply('Please provide a valid year');
        month = parse(month);
        try {
            let display = stripIndents`
        ${firstUpperCase(months[month - 1])} ${year}
        ------------------------------------
        | Su | Mo | Tu | We | Th | Fr | Sa |
        ------------------------------------
    `;
            display += '\n';
            let startDay = new Date(year, month - 1, 1);
            if (year < 100) startDay.setFullYear(year);
            startDay = startDay.getDay();
            for (let i = 0; i < startDay; i++) {
                display += '     ';
            }
            const daysInMonth = month === 2 ? isLeap(year) ? 29 : 28 : monthsWith30.includes(month) ? 30 : 31;
            let currentDay = startDay;
            for (let i = 0; i < daysInMonth; i++) {
                display += `| ${(i + 1).toString().padStart(2, '0')} `;
                if (currentDay === 6 && i + 1 !== daysInMonth) {
                    display += '|\n------------------------------------\n';
                    currentDay = 0;
                } else {
                    currentDay += 1;
                }
            }
            display += '|';
            return message.reply({content: `\`\`\`${display}\`\`\``});
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
