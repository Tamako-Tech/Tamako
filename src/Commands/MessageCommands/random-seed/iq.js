const { join } = require('path');
const { MersenneTwister19937, integer } = require('random-js');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'iq',
    aliases: ['intelligence-quotient'],
    description: 'Determines a user\'s IQ.',
    ownerOnly: false,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Random-Seed',
    usage: '[user]',
    run: async (client, message, [ user ], container) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply('Please provide a valid user.');
        user = parse(user, message);
        const authorUser = user.id === message.author.id;
        if (user.id === client.user.id) return message.reply('Me? My IQ score is off the charts like really!');
        if (user.id === '397338324328775680') {
            if (authorUser) return message.reply('Only someone of the highest IQ could make a bot as good as me!');
            return message.reply(`${user.username}? Not very smart.`);
        }
        
        try {
            const random = MersenneTwister19937.seed(user.id);
            const score = integer(20, 170)(random);
            const embed = new container.Discord.MessageEmbed()
                .setAuthor({name: 'Ummm....'})
                .setDescription(`${authorUser ? 'Your' : `${user.username}'s`} IQ score is ${score}.`)
                .setFooter({ text: `Random Seed | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
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
