const { join } = require('path');
const { MersenneTwister19937, integer } = require('random-js');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'thicc',
    aliases: ['thick'],
    description: 'Determines how thicc you are.',
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
        if (user.id === '397338324328775680') {
            if (user.id === message.author.id) return message.reply(`You are thi${'c'.repeat(100)}`);
            return message.reply('They are thic... without the c');
        }
        try {
            const clientAuthor = user.id === client.user.id;
            const random = MersenneTwister19937.seed(clientAuthor ? message.author.id : user.id);
            const length = integer(0, 100)(random);
            let pronoun = 'They';
            if (user.id === message.author.id) pronoun = 'You';
            return message.reply(`${pronoun} are thi${'c'.repeat(clientAuthor ? length + 1 : length)}`);
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
