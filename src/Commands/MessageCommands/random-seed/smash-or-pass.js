const { join } = require('path');
const { MersenneTwister19937, bool } = require('random-js');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'friendship-meter',
    aliases: ['pass-or-smash', 'smash-pass', 'pass-smash'],
    description: 'Determines if a user is worthy of a smash or a pass.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Random-Seed',
    usage: '[user]',
    run: async(client, message, [ user ], container) => {
        user = user || message.author.id;
        if(!validate(user, message)) return message.reply('Please provide a valid user.');
        user = parse(user, message);
        if (user.id === client.user.id) return message.reply('Obviously smash, Google me.');
        if (user.id === '397338324328775680') {
            if (user.id === message.author.id) return message.reply('I mean... Aren\'t we kind of related? In a way?');
            return message.reply('I sure hope no one is dumb enough to smash that animal.');
        }
        try {
            const random = MersenneTwister19937.seed(user.id);
            const smashOrPass = bool()(random);
            return message.reply(smashOrPass ? ' I\'d definitely smash.' : 'Hard pass. Yuck. Eww');
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
