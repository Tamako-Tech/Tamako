const { join } = require('path');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'month.js'));
const { firstUpperCase, list } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));
const { months } = require(join(__dirname, '..', '..', '..', 'assets', 'json', 'month.json'));
const stones = require(join(__dirname, '..', '..', '..', 'assets', 'json', 'birthstone.json'));

module.exports = {
    name: 'birthstone',
    aliases: [],
    description: 'Responds with the Birthstone for a month.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[month]',
    run: async (client, message, [ month ], container) => {   
        if (!month) return message.reply('Please enter a month.');
        if (!validate(month)) return message.reply('Please enter a valid month.');
        month = parse(month);
        try {
            const stone = stones[month - 1];
            const alternate = stone.alternate ? ` Alternatively, you can also use ${list(stone.alternate, 'or')}.` : '';
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`The Birthstone for ${firstUpperCase(months[month - 1])} is ${stone.primary}.${alternate}`)
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
