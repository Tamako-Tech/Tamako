const { join } = require('path');
const { MersenneTwister19937, integer } = require('random-js');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));
const texts = require(join(__dirname, '../../../assets/json/butt'));

module.exports = {
    name: 'butt',
    aliases: ['butts', 'ass', 'booty'],
    description: 'Butts!',
    ownerOnly: false,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Random-Seed',
    usage: '[user]',
    run: async (client, message, [ user ], Discord) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply('Please provide a valid user.');
        user = parse(user, message);
        const authorUser = user.id === message.author.id;
        try {
            if (user.id === client.user.id) return message.reply('Me? I think I have the best butt around!');
            if (user.id === '397338324328775680') {
                return message.reply('Best Butt on Discord');
            }
            const random = MersenneTwister19937.seed(user.id);
            const quality = integer(0, texts.length - 1)(random);
            let embed = new Discord.MessageEmbed()
                .setAuthor('So we are analyzing Butts now?')
                .setDescription(`${authorUser ? 'Your' : `${user.username}'s`} butt is ${texts[quality]}`)
                .setFooter({ text: `Random Responses | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
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
