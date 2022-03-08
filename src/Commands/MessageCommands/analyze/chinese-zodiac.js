const { join } = require('path');
const signs = require(join(__dirname, '..', '..', '..', 'assets', 'json', 'chinese-zodiac.json'));

module.exports = {
    name: 'chinese-zodiac',
    aliases: ['chinese-zodiac-sign'],
    description: 'Responds with the Chinese Zodiac Sign for the given year.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[year]',
    run: async (client, message, [ year ], container) => {   
        if ( year < 1 ) return message.reply('Please provide a valid year.');
        
        try {
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`The Chinese Zodiac Sign for ${year} is ${signs[year % signs.length]}`)
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

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
