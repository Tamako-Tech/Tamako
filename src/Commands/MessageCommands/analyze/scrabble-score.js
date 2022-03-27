const { join } = require('path');
const { formatNumber } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));
const letters = require(join(__dirname, '..', '..', '..', 'assets', 'json', 'scrabble-score.json'));

module.exports = {
    name: 'scrabble-score',
    aliases: ['scrabble'],
    description: 'Responds with the scrabble score of a word.',
    ownerOnly: false,
    cooldown: 6000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[word]',
    run: async (client, message, [ ...word ], container) => {   
        
        let score = 0;
        if (!word) return message.reply('Please provide a word!');
        word = word.join(' ');
        try {
            for (const letter of word.split('')) {
                if (!letters[letter]) continue;
                score += letters[letter];
            }

            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`Score: ${formatNumber(score)}`)
                .setFooter({ text: `Analyze Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });

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
