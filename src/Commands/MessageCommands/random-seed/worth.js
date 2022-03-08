const { join } = require('path');
const { MersenneTwister19937, integer } = require('random-js');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));
const { formatNumber } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'worth',
    aliases: ['self-worth'],
    description: 'Determines how much a user is worth.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Random-Seed',
    usage: '[user]',
    run: async(client, message, [ user ], container) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply(`${user} is not a valid user.`);
        user = parse(user, message);
        const authorUser = user.id === message.author.id;
        if (user.id === client.user.id) return message.reply('Me? I\'m worth $5/month. At least that\'s how much I cost.');
        if (user.id === '397338324328775680') {
            if (authorUser) return message.reply('Infinity, you amazing owner!');
            return message.reply(`${user.username}, as in my owner Bear? Worthless.... Absolutely worthless.`);
        }
        if (user.id === '410084427098984960') {
            return message.reply(`${user.username} is worth more than anyone else on this Earth! ❤`);
        }
        try {
            const random = MersenneTwister19937.seed(user.id);
            const worth = integer(0, 1000000)(random);
            return message.reply(`${authorUser ? 'You are' : `${user.username} is`} worth $${formatNumber(worth)}.`);
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
