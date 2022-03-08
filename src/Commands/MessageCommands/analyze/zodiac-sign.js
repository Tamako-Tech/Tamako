const { join } = require('path');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'month.js'));
const signs = require(join(__dirname, '..', '..', '..', 'assets', 'json', 'zodiac-sign.json'));
const monthsWith30 = [4, 6, 9, 11];

module.exports = {
    name: 'zodiac-sign',
    aliases: ['zodiac'],
    description: 'Responds with the Zodiac Sign for the given month/day.',
    ownerOnly: false,
    cooldown: 6000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[month] [day]',
    run: async (client, message, [ month, day ], container) => {   

        if (!month) return message.reply('Please provide a month');
        if (!validate(month)) return message.reply('Please provide a valid month');
        month = parse(month);
        try {
            if (day > 31) return message.reply('Please provide a valid day');
        
            const sign = determineSign(month, day);
            if (!sign) return message.reply('Invalid day.');
    
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`The Zodiac Sign for ${month}/${day} is ${sign.name}.`)
                .setFooter({ text: `Analyze Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
    
            return message.reply({ embeds: [embed] });

        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://container.Discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new container.Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }
    }   
};

function determineSign(month, day) {
    if (month === 2 && day > 29) return null;
    if (monthsWith30.includes(month) && day > 30) return null;
    if (day < 1 || day > 31) return null;
    return signs.find(sign => {
        if (month === sign.high.month && day <= sign.high.day) return true;
        if (month === sign.low.month && day >= sign.low.day) return true;
        return false;
    });
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
