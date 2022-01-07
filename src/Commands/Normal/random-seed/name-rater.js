const { join } = require('path');
const { MersenneTwister19937, integer } = require('random-js');
const texts = require(join(__dirname, '../../../assets/json/name-rater'));

module.exports = {
    name: 'name-rater',
    aliases: ['name-rate', 'rate-name'],
    description: 'Determines a name\'s quality.',
    ownerOnly: false,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Random-Seed',
    usage: '[name]',
    run: async (client, message, [ name ], Discord) => {
        name = name || message.author.username;
        if (name.toLowerCase() === 'tamako') {
            return message.reply(` Yes, ${name}! What a perfect name! I'm speechless!`);
        }
        if (name.toLowerCase() === 'mai') {
            return message.reply(` Yes, ${name}! What a perfect name! My Onee-chan's name is also mai!`);
        }
        
        try {
            const random = MersenneTwister19937.seed(stringToSeed(name.toLowerCase()));
            const quality = integer(0, texts.length - 1)(random);
            return message.reply(`${texts[quality].replace(/{{name}}/gi, name)}`);

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

function stringToSeed(str) {
    if (!str) return 0;
    let hash = 0;
    for (const char of str.split('')) {
        hash += char.charCodeAt(0);
    }
    return hash;
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
