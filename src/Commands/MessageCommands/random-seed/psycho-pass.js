const { join } = require('path');
const { MersenneTwister19937, integer } = require('random-js');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));
const { under100, between, over300 } = require(join(__dirname, '..', '..', '..', 'assets', 'json', 'psycho-pass.json'));

module.exports = {
    name: 'psycho-pass',
    aliases: ['crime-coefficient'],
    description: 'Determines your Crime Coefficient.',
    ownerOnly: false,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Random-Seed',
    usage: '[user]',
    run: async (client, message, [ user ], container) => {
        
        user = user || message.author.id;
        if(!validate(user, message)) return message.reply('Please provide a valid user.');
        user = parse(user, message);
        if (user.id === client.user.id) return message.reply('Me? I-I\'m not dangerous, I promise!');
        
        try {
            const random = MersenneTwister19937.seed(user.id);
            const coefficient = integer(0, 500)(random);
            let res;
            if (coefficient < 100) res = under100;
            else if (coefficient > 300) res = over300;
            else res = between;
            const embed = new container.Discord.MessageEmbed()
                .setAuthor('Ummm....')
                .setDescription(`${message.author.id === user.id ? 'Your' : `Suspect ${user.username}'s`} Crime Coefficient is ${coefficient}. ${res}`)
                .setFooter({ text: `Random Seed | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
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
