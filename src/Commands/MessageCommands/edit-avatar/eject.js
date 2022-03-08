const { join } = require('path');
const { MersenneTwister19937, bool } = require('random-js');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'eject',
    aliases: [ ],
    description: 'AmogSus Imposter',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Avatar',
    usage: '[user] [Is user an imposter? (true/false)]',
    run: async (client, message, [ user, imposter = '' ], container) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply(`${message.author} That is not a valid user.`);
        user = parse(user, message);
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
        try {
            if (imposter === '') {
                const random = MersenneTwister19937.seed(user.id);
                imposter = bool()(random);
            }
            if (imposter === 'true' || imposter === 't' || imposter === 'yes' || imposter === 'y' || imposter === 'on' || imposter === 'enable' || imposter === 'enabled' || imposter === '1' || imposter === '+') {
                imposter = 1;
            } else {
                imposter = 0;
            }
            const text = `${user.username} was${imposter ? ' ' : ' not '}An Imposter.`;

            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-avatar/eject`)
                .query({ avatarURL: avatarURL, imposter: imposter, username: user.username, userID: user.id });
            
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(text)
                .setImage('attachment://eject.gif')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            
            return message.reply({ files: [{ attachment: body, name: 'eject.gif' }], embeds: [embed] });
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