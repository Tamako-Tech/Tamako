const { join } = require('path');
const { MersenneTwister19937, integer } = require('random-js');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));
const { eyeColors, hairColors, hairStyles, extras } = require(join(__dirname, '..', '..', '..', 'assets', 'json', 'guess-looks.json'));
const genders = ['male', 'female'];

module.exports = {
    name: 'guess-looks',
    aliases: ['guess-my-looks'],
    description: 'Guesses what a user looks like.',
    ownerOnly: false,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Random-Seed',
    usage: '[user]',
    run: async (client, message, [ user ], container) => {
        user = user || message.author.id;
        if(!validate(user, message)) return message.reply('Please provide a valid user.');
        user = parse(user, message);
        if (user.id === client.user.id) return message.reply('Me? Just look at my avatar, dummy.');
        const authorUser = user.id === message.author.id;
        if (user.id === '397338324328775680') {            
            if (authorUser) return message.reply('You look amazing as always! ❤');
            return message.reply('He look amazing as always! ❤');
        }
        try {
            const random = MersenneTwister19937.seed(user.id);
            const gender = genders[integer(0, genders.length - 1)(random)];
            const eyeColor = eyeColors[integer(0, eyeColors.length - 1)(random)];
            const hairColor = hairColors[integer(0, hairColors.length - 1)(random)];
            const hairStyle = hairStyles[integer(0, hairStyles.length - 1)(random)];
            const age = integer(10, 100)(random);
            const feet = integer(3, 7)(random);
            const inches = integer(0, 11)(random);
            const weight = integer(50, 300)(random);
            const extra = extras[integer(0, extras.length - 1)(random)];
            const embed = new container.Discord.MessageEmbed()
                .setAuthor({name: 'I think.....'})
                .setDescription(`${authorUser ? 'you are' : `${user.username} is`} a ${age} year old ${gender} with ${eyeColor} eyes\nand ${hairStyle} ${hairColor} hair. ${authorUser ? 'You are' : `${gender === 'male' ? 'He' : 'She'} is`}\n${feet}'${inches}" and weigh${authorUser ? '' : 's'} ${weight} pounds. Don't forget the ${extra}!`)
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
